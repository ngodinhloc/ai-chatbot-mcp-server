import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { TOOLS_CONFIG, ToolsConfig, ToolHandler } from '../tools/tools.config';
import { ExecutionContextDto } from '../contracts/call-tool.dto';

@Injectable()
export class McpService {
  constructor(@Inject(TOOLS_CONFIG) private readonly toolsConfig: ToolsConfig) {}

  async listTools(): Promise<Tool[]> {
    const seen = new Set<ToolHandler>();
    const results: Tool[][] = [];
    for (const handler of this.toolsConfig.values()) {
      if (!seen.has(handler)) {
        seen.add(handler);
        results.push(await handler.listTools());
      }
    }
    return results.flat();
  }

  async callTool(
    name: string,
    args: Record<string, unknown>,
    context?: Partial<ExecutionContextDto>,
  ): Promise<CallToolResult> {
    const handler = this.toolsConfig.get(name);
    if (!handler) {
      throw new NotFoundException(`Tool not found: ${name}`);
    }
    return handler.callTool(name, args, context);
  }
}
