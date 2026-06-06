export interface ExecutionContext {
  user_id: string;
  roles: string[];
}

export interface McpClientInterface {
  callTool(
    name: string,
    input: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<unknown>;
}
