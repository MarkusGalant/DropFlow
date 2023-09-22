import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { TaskDto } from 'src/dtos/task.dto';

import { CreateWorkflowExecutionDto, WorkflowExecutionDto } from '../dtos';
import { TaskService, WorkflowExecutionService } from '../services';

@Controller('executions')
export class ExecutionController {
  constructor(
    private readonly workflowExecutionService: WorkflowExecutionService,
    private readonly taskService: TaskService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: [WorkflowExecutionDto] })
  async getAllByWorkflow() {
    return await this.workflowExecutionService.getAll();
  }

  @Get('/:executionId')
  @HttpCode(200)
  @ApiOkResponse({ type: [WorkflowExecutionDto] })
  async getOneByWorkflow(@Param('executionId') executionId: string) {
    return await this.workflowExecutionService.getOne(executionId);
  }

  @Get('/:executionId/tasks')
  @HttpCode(200)
  @ApiOkResponse({ type: [TaskDto] })
  async getTasks(@Param('executionId') executionId: string) {
    return await this.taskService.getAllByExecution(executionId);
  }

  @Post()
  @HttpCode(201)
  @ApiOkResponse({ type: [WorkflowExecutionDto] })
  async execute(@Body() body: CreateWorkflowExecutionDto) {
    return await this.workflowExecutionService.execute(body);
  }
}
