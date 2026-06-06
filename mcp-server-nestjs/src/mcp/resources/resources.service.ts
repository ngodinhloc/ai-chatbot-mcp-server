import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Resource, ReadResourceResult } from '@modelcontextprotocol/sdk/types.js';

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  async listResources(): Promise<Resource[]> {
    return [
      {
        uri: 'mcp://server/info',
        name: 'Server Info',
        description: 'Basic information about this MCP server',
        mimeType: 'application/json',
      },
    ];
  }

  async readResource(uri: string): Promise<ReadResourceResult> {
    this.logger.debug(`Reading resource: ${uri}`);

    switch (uri) {
      case 'mcp://server/info':
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ name: 'mcp-server', status: 'running' }),
            },
          ],
        };

      default:
        throw new NotFoundException(`Resource not found: ${uri}`);
    }
  }
}
