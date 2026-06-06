import { container } from 'tsyringe';
import { useContainer } from 'routing-controllers';
import { ClaudeAdapter } from './modules/chat/adapters/claude.adapter';
import { McpClient } from './modules/mcp-client/services/mcp.client';
import { ChatService } from './modules/chat/services/chat.service';
import { ChatController } from './modules/chat/controllers/chat.controller';
import { McpServerRepository } from './modules/mcp-server/repositories/mcp-server.repository';
import { HealthCheckController } from './modules/health/health.controller';
import { Logger } from './common/logger/logger';

useContainer({ get: (token: any) => container.resolve(token) });

container.registerSingleton(Logger);
container.registerSingleton(ClaudeAdapter);
container.registerSingleton(McpClient);
container.registerSingleton(McpServerRepository);
container.registerSingleton(ChatService);
container.registerSingleton(ChatController);
container.registerSingleton(HealthCheckController);

export { container };
