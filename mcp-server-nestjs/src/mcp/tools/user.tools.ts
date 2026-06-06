import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ExecutionContextDto } from '../contracts/call-tool.dto';

const EMPTY_SCHEMA = { type: 'object' as const, properties: {} };

export const USER_TOOLS: Tool[] = [
  {
    name: 'get_user_profile',
    description: 'Retrieve the current user\'s profile including name, email, bio, and avatar',
    inputSchema: EMPTY_SCHEMA,
  },
  {
    name: 'get_user_skills',
    description: 'Retrieve the current user\'s skills including skill level and years of experience',
    inputSchema: EMPTY_SCHEMA,
  },
  {
    name: 'get_user_experiences',
    description: 'Retrieve the current user\'s work experience history',
    inputSchema: EMPTY_SCHEMA,
  },
  {
    name: 'get_user_qualification',
    description: 'Retrieve the current user\'s academic and professional qualifications',
    inputSchema: EMPTY_SCHEMA,
  },
];

@Injectable()
export class UserTools {
  private readonly logger = new Logger(UserTools.name);

  async listTools(): Promise<Tool[]> {
    return USER_TOOLS;
  }

  async callTool(
    name: string,
    args: Record<string, unknown> = {},
    context?: Partial<ExecutionContextDto>,
  ): Promise<CallToolResult> {
    this.logger.debug(`Calling tool: ${name} with args: ${JSON.stringify(args)}`);

    const userId = context?.user_id;

    switch (name) {
      case 'get_user_profile':
        return this.fetchUserService(`/api/users/${userId}/profile`);

      case 'get_user_skills':
        return this.fetchUserService(`/api/users/${userId}/skills`);

      case 'get_user_experiences':
        return this.fetchUserService(`/api/users/${userId}/experience`);

      case 'get_user_qualification':
        return this.fetchUserService(`/api/users/${userId}/qualifications`);

      default:
        throw new NotFoundException(`Tool not found: ${name}`);
    }
  }

  private async fetchUserService(path: string): Promise<CallToolResult> {
    const baseUrl = process.env.USER_SERVICE_URL ?? 'http://localhost:4001';
    const res = await fetch(`${baseUrl}${path}`);
    if (!res.ok) {
      throw new Error(`Upstream service error [${path}]: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return { content: [{ type: 'text', text: JSON.stringify(data) }] };
  }
}
