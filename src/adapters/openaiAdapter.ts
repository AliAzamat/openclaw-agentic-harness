import { ModelAdapter, Message, ToolSpec } from "./adapter";
import { ModelResponse } from "../types";

// Wraps an OpenAI-style client. The ONLY place OpenAI's request/response format
// is known. It translates the provider's tool calls into our canonical ToolCall.
export function openaiAdapter(client: { chat(req: unknown): Promise<any> }): ModelAdapter {
  return {
    async complete(messages: Message[], tools: ToolSpec[]): Promise<ModelResponse> {
      const res = await client.chat({
        messages,
        tools: tools.map((t) => ({ type: "function", function: t })),
      });
      const choice = res.choices[0].message;
      if (choice.tool_calls?.length) {
        return {
          toolCalls: choice.tool_calls.map((c: any) => ({
            id: c.id,
            name: c.function.name,
            args: JSON.parse(c.function.arguments),
          })),
        };
      }
      return { text: choice.content };
    },
  };
}
