import { Permission, ToolCall, ToolResult } from "../types";
import { ToolSpec } from "../adapters/adapter";

export interface Tool {
  spec: ToolSpec;                 // name, description, inputSchema (the model reads this)
  permission: Permission;
  handler: (args: Record<string, unknown>) => Promise<unknown>;
}

export class Registry {
  private tools = new Map<string, Tool>();

  register(t: Tool): void {
    this.tools.set(t.spec.name, t);
  }

  // Tools the model is allowed to SEE. Forbidden tools are never offered — the
  // safest control is the one the model can't even call.
  specsForModel(): ToolSpec[] {
    return [...this.tools.values()].filter((t) => t.permission !== "forbidden").map((t) => t.spec);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  // Validate args against the tool's schema BEFORE the handler runs. A
  // hallucinated arg dies here, not inside your integration.
  validate(call: ToolCall): string | null {
    const tool = this.tools.get(call.name);
    if (!tool) return `unknown tool: ${call.name}`;
    const req = (tool.spec.inputSchema.required as string[] | undefined) ?? [];
    for (const key of req) {
      if (!(key in call.args)) return `missing required arg: ${key}`;
    }
    return null; // ok
  }
}
