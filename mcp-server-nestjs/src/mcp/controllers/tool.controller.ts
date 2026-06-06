import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { McpService } from '../services/mcp.service';
import { CallToolDto } from '../contracts/call-tool.dto';

@Controller('mcp/tools')
export class ToolController {
  private readonly logger = new Logger(ToolController.name);

  constructor(private readonly mcpService: McpService) {}

  @Get()
  async getTools() {
    this.logger.log('GET /mcp/tools');
    return { tools: await this.mcpService.listTools() };
  }

  @Post('call')
  async callTool(@Body() body: CallToolDto) {
    this.logger.log(`POST /mcp/tools/call — tool: ${body.tool_call.name}, user: ${body.execution_context?.user_id}`);
    const result = await this.mcpService.callTool(body.tool_call.name, body.tool_call.arguments ?? {}, body.execution_context);
    this.logger.log(`Response: ${JSON.stringify(result)}`);
    return result;
  }
}
