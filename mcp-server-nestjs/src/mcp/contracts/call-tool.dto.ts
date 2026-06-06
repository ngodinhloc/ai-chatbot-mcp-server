import { IsString, IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ExecutionContextDto {
  @IsString()
  user_id: string;

  @IsArray()
  @IsString({ each: true })
  roles: string[];
}

export class ToolCallDto {
  @IsString()
  name: string;

  @IsObject()
  arguments: Record<string, unknown>;
}

export class CallToolDto {
  @ValidateNested()
  @Type(() => ToolCallDto)
  tool_call: ToolCallDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExecutionContextDto)
  execution_context?: ExecutionContextDto;
}
