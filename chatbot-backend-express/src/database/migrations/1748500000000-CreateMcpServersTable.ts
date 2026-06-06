import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMcpServersTable1748500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS mcp_servers (
        id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name       VARCHAR NOT NULL,
        url        VARCHAR NOT NULL,
        tools      JSONB NOT NULL DEFAULT '[]'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE mcp_servers`);
  }
}
