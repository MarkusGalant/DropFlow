import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { ToolDto } from '../dtos';

import { ToolManager } from 'src/tools/tool.manager';

@Controller('tools')
export class ToolController {
  constructor(private readonly toolManager: ToolManager) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: [ToolDto] })
  async getAll() {
    return await this.toolManager.getAll();
  }
}
