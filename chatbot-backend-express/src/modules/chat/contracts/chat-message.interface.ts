export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface McpToolProperty {
  type: string;
  description: string;
}

export interface McpToolInputSchema {
  type: 'object';
  properties: Record<string, McpToolProperty>;
  required: string[];
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: McpToolInputSchema;
}

export interface LlmToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface LlmToolResult {
  toolUseId: string;
  content: string;
}

export interface LlmResponse {
  text: string | null;
  toolCalls: LlmToolCall[];
  stopReason: string;
  // Raw Anthropic content blocks — opaque to the service layer, passed back
  // to the driver to correctly construct the next tool-result turn.
  rawContent: unknown;
}

export interface LlmChatRequest {
  messages: ChatMessage[];
  tools: McpTool[];
  // Populated on tool-result continuation turns only
  toolResults?: LlmToolResult[];
  previousRawContent?: unknown;
}

export interface ExecutionContextForChat {
  user_id: string;
  roles: string[];
}

export interface ChatRequest {
  message: string;
  execution_context?: ExecutionContextForChat;
}

export const DEFAULT_CONTEXT: ExecutionContextForChat = {
  user_id: 'a1b2c3d4-0001-0001-0001-000000000001',
  roles: ['employee'],
};
