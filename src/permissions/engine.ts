import { Permission, ToolCall } from "../types";
import { Registry } from "../tools/registry";

export type Decision =
  | { kind: "run" }                    // execute now
  | { kind: "draft" }                  // run but mark output as not-sent
  | { kind: "needs_approval"; level: "approval-required" | "dangerous" }
  | { kind: "blocked"; reason: string };

// The rule of the whole harness: read freely, draft safely, ASK before anything
// irreversible, and never run the forbidden.
export function decide(reg: Registry, call: ToolCall): Decision {
  const tool = reg.get(call.name);
  if (!tool) return { kind: "blocked", reason: `unknown tool ${call.name}` };

  switch (tool.permission) {
    case "read-only":
      return { kind: "run" };
    case "draft-only":
      return { kind: "draft" };
    case "approval-required":
      return { kind: "needs_approval", level: "approval-required" };
    case "dangerous":
      return { kind: "needs_approval", level: "dangerous" };
    case "forbidden":
      return { kind: "blocked", reason: `forbidden tool ${call.name}` };
  }
}
