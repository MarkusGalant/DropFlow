import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { TaskStatus } from 'src/models';

export class TaskDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  executionId: string;

  @ApiProperty()
  @IsString()
  previousTaskId: string | null;

  @ApiProperty()
  @IsString()
  workflowId: string;

  @ApiProperty()
  @IsString()
  workflowStepId: string;

  @ApiProperty()
  @IsString()
  walletId: string;

  @ApiProperty()
  @IsString()
  walletName: string;

  @ApiProperty()
  @IsString()
  toolId: string;

  @ApiProperty()
  @IsString()
  status: TaskStatus;

  @ApiProperty()
  @IsString()
  params: any;

  @ApiProperty()
  @IsString()
  data: any;

  @ApiProperty()
  @IsString()
  error: any;

  @ApiProperty()
  @IsString()
  createdAt: Date | null;

  @ApiProperty()
  @IsString()
  startedAt: Date | null;

  @ApiProperty()
  @IsString()
  endedAt: Date | null;
}
