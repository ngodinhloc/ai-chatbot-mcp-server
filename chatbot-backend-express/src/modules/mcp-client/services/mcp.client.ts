import { injectable } from 'tsyringe';
import { env } from '../../../config/env';
import { McpClientInterface, ExecutionContext } from '../contracts/mcp-client.interface';
import { PayloadInterface } from '../contracts/payload.interface';

@injectable()
export class McpClient implements McpClientInterface {
  async callTool(
    name: string,
    input: Record<string, unknown>,
    context: ExecutionContext
  ): Promise<unknown> {
    const body: PayloadInterface = {
      tool_call: {
        name,
        arguments: input,
      },
      execution_context: context,
    };

    const res = await fetch(`${env.mcpServerUrl}/mcp/tools/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`MCP tool call failed [${name}]: ${res.status} ${res.statusText}`);
    }

    return res.json();
  }
}
