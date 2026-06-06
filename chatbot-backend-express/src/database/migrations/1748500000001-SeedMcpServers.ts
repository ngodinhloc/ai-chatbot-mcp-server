import { MigrationInterface, QueryRunner } from 'typeorm';

const TOOLS = [
  {
    name: 'get_user_profile',
    description: 'Retrieve a user profile including name, email, bio, and avatar',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'The UUID of the user' },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'get_user_skills',
    description: 'Retrieve the list of skills for a user, including skill level and years of experience',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'The UUID of the user' },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'get_user_experiences',
    description: 'Retrieve the work experience history for a user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'The UUID of the user' },
      },
      required: ['user_id'],
    },
  },
  {
    name: 'get_user_qualification',
    description: 'Retrieve the academic and professional qualifications for a user',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'The UUID of the user' },
      },
      required: ['user_id'],
    },
  },
];

export class SeedMcpServers1748500000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO mcp_servers (id, name, url, tools)
      VALUES (
        gen_random_uuid(),
        'user-mcp-server',
        'http://mcp-server:3000',
        '${JSON.stringify(TOOLS)}'::jsonb
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM mcp_servers WHERE name = 'user-mcp-server'`);
  }
}
