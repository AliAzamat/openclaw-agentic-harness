// The vocabulary the whole harness shares.

// One canonical tool-call shape. Every model adapter translates its provider's
// format INTO this, so the loop is provider-agnostic.
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface ModelResponse {
  text?: string;          // a final answer, if the model is done
  toolCalls?: ToolCall[]; // tools the model wants to run, if it isn't
}

export type Permission =
  | "read-only"          // run freely
  | "draft-only"         // produce output, never send/commit
  | "approval-required"  // pause for a human
  | "dangerous"          // pause + extra confirmation
  | "forbidden";         // never offered to the model

export interface ToolResult {
  callId: string;
  ok: boolean;
  output: unknown;
}
