import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { CreateWorkflowDto, UpdateWorkflowDto, WorkflowDto } from '../dtos';
import { WorkflowService } from '../services';

@Controller('workflows')
export class WorkflowController {
  constructor(private readonly walletService: WorkflowService) {}

  @Get('/:workflowId')
  @HttpCode(200)
  @ApiOkResponse({ type: WorkflowDto })
  async getOneById(@Param('workflowId') workflowId: string) {
    return await this.walletService.getOneById(workflowId);
  }

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: [WorkflowDto] })
  async getAll() {
    return await this.walletService.getAll();
  }

  @Post()
  @HttpCode(201)
  @ApiOkResponse()
  async createOne(@Body() body: CreateWorkflowDto) {
    return await this.walletService.createOne(body);
  }

  @Put('/:workflowId')
  @HttpCode(200)
  @ApiOkResponse()
  async updateOne(
    @Param('workflowId') workflowId: string,
    @Body() body: UpdateWorkflowDto,
  ) {
    return await this.walletService.updateOne(workflowId, body);
  }

  @Delete('/:workflowId')
  @HttpCode(200)
  @ApiOkResponse()
  async deleteOne(@Param('workflowId') workflowId: string) {
    return await this.walletService.deleteOne(workflowId);
  }
}
