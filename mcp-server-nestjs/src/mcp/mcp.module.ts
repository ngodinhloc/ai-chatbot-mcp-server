import { Module } from '@nestjs/common';
import { ToolController } from './controllers/tool.controller';
import { McpService } from './services/mcp.service';
import { UserTools } from './tools/user.tools';
import { TOOLS_CONFIG, buildToolsConfig } from './tools/tools.config';
import { ResourcesService } from './resources/resources.service';
import { PromptsService } from './prompts/prompts.service';

@Module({
  controllers: [ToolController],
  providers: [
    UserTools,
    ResourcesService,
    PromptsService,
    {
      provide: TOOLS_CONFIG,
      useFactory: buildToolsConfig,
      inject: [UserTools],
    },
    McpService,
  ],
})
export class McpModule {}
