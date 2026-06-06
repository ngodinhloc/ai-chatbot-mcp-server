import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mcp_servers')
export class McpServer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: 'jsonb', default: [] })
  tools: object[];
}
