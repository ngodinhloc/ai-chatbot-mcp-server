import { injectable } from 'tsyringe';
import { AppDataSource } from '../../../database/data-source';
import { McpServer } from '../entities/mcp-server.entity';
import { McpTool } from '../../chat/contracts/chat-message.interface';

@injectable()
export class McpServerRepository {
  private get repo() {
    return AppDataSource.getRepository(McpServer);
  }

  async getAllTools(): Promise<McpTool[]> {
    const servers = await this.repo.find();
    return servers.flatMap((server) => server.tools as McpTool[]);
  }
}
