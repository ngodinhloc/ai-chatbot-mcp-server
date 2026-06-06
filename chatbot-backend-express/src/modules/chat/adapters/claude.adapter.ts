import { injectable } from 'tsyringe';
import Anthropic from '@anthropic-ai/sdk';
import { AdapterInterface } from '../contracts/adapter.interface';
import { LlmChatRequest, LlmResponse, LlmToolCall } from '../contracts/chat-message.interface';

@injectable()
export class ClaudeAdapter implements AdapterInterface {
  private readonly client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async ask(request: LlmChatRequest): Promise<LlmResponse> {
    const systemMessage = request.messages.find((m) => m.role === 'system');
    const conversationMessages = request.messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const anthropicMessages: Anthropic.MessageParam[] = [...conversationMessages];

    if (request.previousRawContent && request.toolResults?.length) {
      anthropicMessages.push({
        role: 'assistant',
        content: request.previousRawContent as Anthropic.ContentBlock[],
      });
      anthropicMessages.push({
        role: 'user',
        content: request.toolResults.map((tr) => ({
          type: 'tool_result' as const,
          tool_use_id: tr.toolUseId,
          content: tr.content,
        })),
      });
    }

    const tools: Anthropic.Tool[] = request.tools.map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema as Anthropic.Tool['input_schema'],
    }));

    const response = await this.client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 8096,
      ...(systemMessage && { system: systemMessage.content }),
      messages: anthropicMessages,
      ...(tools.length > 0 && { tools, tool_choice: { type: 'auto' } }),
    });

    const toolCalls: LlmToolCall[] = response.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === 'tool_use')
      .map((b) => ({ id: b.id, name: b.name, input: b.input as Record<string, unknown> }));

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text');

    return {
      text: textBlock ? textBlock.text : null,
      toolCalls,
      stopReason: response.stop_reason ?? 'end_turn',
      rawContent: response.content,
    };
  }
}
