import { ToolCall } from "../types";

export interface AuditEntry {
  tool: string;
  args: Record<string, unknown>;
  decision: string;   // run | draft | needs_approval | blocked
  outcome: string;    // ran | approved | denied | blocked
}

const trail: AuditEntry[] = [];

// Every tool call + decision is recorded. This is non-negotiable: an agent that
// can act on real systems must leave a record of what it did and who allowed it.
export function audit(call: ToolCall, decision: string, outcome: string): void {
  trail.push({ tool: call.name, args: call.args, decision, outcome });
}

export function auditTrail(): AuditEntry[] {
  return trail;
}
