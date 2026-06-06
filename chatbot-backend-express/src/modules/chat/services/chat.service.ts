import { injectable, inject } from 'tsyringe';
import { ClaudeAdapter } from '../adapters/claude.adapter';
import { McpClient } from '../../mcp-client/services/mcp.client';
import { McpServerRepository } from '../../mcp-server/repositories/mcp-server.repository';
import { ChatRequest, LlmChatRequest, LlmToolResult, DEFAULT_CONTEXT } from '../contracts/chat-message.interface';
import { AdapterInterface } from '../contracts/adapter.interface';
import { Logger } from '../../../common/logger/logger';

const SYSTEM_PROMPT =
  'You are an HR career assistant. The current user is already identified — call tools directly without asking for a user ID. Use available tools whenever you need real-time employee data. Be precise and evidence-based.';

@injectable()
export class ChatService {
  constructor(
    @inject(ClaudeAdapter) private readonly chatAdapter: AdapterInterface,
    private readonly mcpClient: McpClient,
    private readonly mcpServerRepository: McpServerRepository,
    private readonly logger: Logger,
  ) {}

  async chat(request: ChatRequest): Promise<{ reply: string }> {
    const context = request.execution_context ?? DEFAULT_CONTEXT;
    const tools = await this.mcpServerRepository.getAllTools();

    let llmRequest: LlmChatRequest = {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: request.message },
      ],
      tools,
    };

    let response = await this.chatAdapter.ask(llmRequest);
    this.logger.info('chatAdapter response', { stopReason: response.stopReason, toolCalls: response.toolCalls, text: response.text });

    while (response.stopReason === 'tool_use' && response.toolCalls.length > 0) {
      const toolResults: LlmToolResult[] = await Promise.all(
        response.toolCalls.map(async (tc) => {
          const result = await this.mcpClient.callTool(tc.name, tc.input, context);
          return {
            toolUseId: tc.id,
            content: typeof result === 'string' ? result : JSON.stringify(result),
          };
        }),
      );

      llmRequest = { ...llmRequest, toolResults, previousRawContent: response.rawContent };
      response = await this.chatAdapter.ask(llmRequest);
      this.logger.info('chatAdapter response', { stopReason: response.stopReason, toolCalls: response.toolCalls, text: response.text });
    }

    return { reply: response.text ?? '' };
  }
}
