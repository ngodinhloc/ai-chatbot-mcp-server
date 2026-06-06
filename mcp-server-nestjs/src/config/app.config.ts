import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  mcp: {
    serverName: process.env.MCP_SERVER_NAME ?? 'mcp-server',
    serverVersion: process.env.MCP_SERVER_VERSION ?? '1.0.0',
  },
}));
