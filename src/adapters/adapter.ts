import { ModelResponse, ToolCall } from "../types";

// A tool, as the model needs to see it (name + description + schema).
export interface ToolSpec {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface Message {
  role: "user" | "assistant" | "tool";
  content: string;
  toolCallId?: string;   // when role === "tool", which call this answers
}

// One interface. Every provider implements complete(); the loop calls only this.
export interface ModelAdapter {
  complete(messages: Message[], tools: ToolSpec[]): Promise<ModelResponse>;
}
