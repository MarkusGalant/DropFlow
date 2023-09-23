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
    const tools = await this.toolManager.getAll();

    return tools.map((tool) => ({
      id: tool.id,
      networkId: tool.networkId,
      name: tool.name,
      icon: tool.icon,
      defaultParams: tool.defaultParams,
      ui: tool.ui,
    }));
  }
}
