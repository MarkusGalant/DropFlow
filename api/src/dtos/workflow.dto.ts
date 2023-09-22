import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WorkflowDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => WorkflowStepDto)
  @ValidateNested({ each: true })
  steps: WorkflowStepDto[];
}

export class WorkflowStepDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  toolId: string;

  @ApiProperty()
  @IsObject()
  params: any;
}

export class WorkflowExecutionDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  @Type(() => WorkflowDto)
  @ValidateNested()
  workflow: WorkflowDto;

  @ApiProperty()
  @IsString()
  walletGroupId: string;

  @ApiProperty()
  @IsDateString()
  startedAt: string | null;

  @ApiProperty()
  @IsDateString()
  endedAt: string | null;
}

export class CreateWorkflowStepDto extends OmitType(WorkflowStepDto, ['id']) {}

export class CreateWorkflowDto extends OmitType(WorkflowDto, ['id', 'steps']) {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkflowStepDto)
  steps: CreateWorkflowStepDto[];
}

export class UpdateWorkflowDto extends OmitType(WorkflowDto, ['id']) {}
export class CreateWorkflowExecutionDto extends PickType(WorkflowExecutionDto, [
  'note',
  'workflow',
  'walletGroupId',
]) {}
