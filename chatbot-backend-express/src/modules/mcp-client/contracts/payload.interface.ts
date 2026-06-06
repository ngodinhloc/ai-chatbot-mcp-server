import { ExecutionContext } from './mcp-client.interface';

export interface ToolCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface PayloadInterface {
  tool_call: ToolCall;
  execution_context: ExecutionContext;
}
