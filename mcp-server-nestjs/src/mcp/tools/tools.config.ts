import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ExecutionContextDto } from '../contracts/call-tool.dto';
import { UserTools } from './user.tools';

export const TOOLS_CONFIG = 'TOOLS_CONFIG';

export interface ToolHandler {
  listTools(): Promise<Tool[]>;
  callTool(
    name: string,
    args: Record<string, unknown>,
    context?: Partial<ExecutionContextDto>,
  ): Promise<CallToolResult>;
}

export type ToolsConfig = Map<string, ToolHandler>;

export function buildToolsConfig(userTools: UserTools): ToolsConfig {
  return new Map<string, ToolHandler>([
    ['get_user_profile', userTools],
    ['get_user_skills', userTools],
    ['get_user_experiences', userTools],
    ['get_user_qualification', userTools],
  ]);
}
