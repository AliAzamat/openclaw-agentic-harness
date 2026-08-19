import { ModelAdapter, Message, ToolSpec } from "./adapter";
import { ModelResponse } from "../types";

// A local model (Ollama/vLLM/LM Studio) behind the SAME interface. Its provider
// format differs entirely — but the loop above can't tell, because it only ever
// sees ModelResponse. Swap this in with one line and nothing else changes.
export function localAdapter(client: { generate(req: unknown): Promise<any> }): ModelAdapter {
  return {
    async complete(messages: Message[], tools: ToolSpec[]): Promise<ModelResponse> {
      const res = await client.generate({ messages, tool_schemas: tools });
      // Pretend the local runtime returns { action: "tool"|"final", ... }
      if (res.action === "tool") {
        return { toolCalls: [{ id: res.call_id, name: res.tool, args: res.arguments }] };
      }
      return { text: res.answer };
    },
  };
}
