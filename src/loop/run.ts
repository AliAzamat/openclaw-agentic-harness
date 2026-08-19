import { ModelAdapter, Message } from "../adapters/adapter";
import { Registry } from "../tools/registry";
import { decide } from "../permissions/engine";
import { ToolResult } from "../types";
import { audit } from "../audit/log";

export interface ApprovalGate {
  // Returns true if the human approves this call. (CLI prompt, Slack button, etc.)
  ask(toolName: string, args: Record<string, unknown>, reasoning: string): Promise<boolean>;
}

export async function runAgent(
  model: ModelAdapter,
  reg: Registry,
  gate: ApprovalGate,
  task: string,
  maxSteps = 8
): Promise<string> {
  const messages: Message[] = [{ role: "user", content: task }];

  for (let step = 0; step < maxSteps; step++) {
    const res = await model.complete(messages, reg.specsForModel());

    if (!res.toolCalls?.length) {
      return res.text ?? "(no answer)";   // the model is done
    }

    for (const call of res.toolCalls) {
      const bad = reg.validate(call);
      if (bad) { messages.push({ role: "tool", content: `error: ${bad}`, toolCallId: call.id }); continue; }

      const decision = decide(reg, call);
      const tool = reg.get(call.name)!;
      let output: unknown;

      if (decision.kind === "blocked") {
        audit(call, decision.kind, "blocked");
        messages.push({ role: "tool", content: `blocked: ${decision.reason}`, toolCallId: call.id });
        continue;
      }
      if (decision.kind === "needs_approval") {
        const ok = await gate.ask(call.name, call.args, "model requested this action");
        audit(call, decision.kind, ok ? "approved" : "denied");
        if (!ok) { messages.push({ role: "tool", content: "denied by human", toolCallId: call.id }); continue; }
      }
      // run (or draft, or approved): execute the handler
      output = await tool.handler(call.args);
      if (decision.kind === "draft") output = `[DRAFT — not sent] ${output}`;
      audit(call, decision.kind, "ran");
      messages.push({ role: "tool", content: String(output), toolCallId: call.id });
    }
  }
  return "(stopped: hit the step ceiling)";
}
