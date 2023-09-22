import { Injectable } from '@nestjs/common';

import { Wallet } from 'src/models';
import { ToolDto } from 'src/dtos';

import { ZkSYncSyncSwapTool } from './zksync-syncswap.tool';

export type Tool = {
  id: string;
  name: string;
  defaultParams: any;
  ui: any;
  execute(wallet: Wallet, params: any): Promise<any>;
  isCompleted(wallet: Wallet, result: any): Promise<boolean>;
};

@Injectable()
export class ToolManager {
  constructor(private zkSYncSyncSwapTool: ZkSYncSyncSwapTool) {}

  public tools: Tool[] = [this.zkSYncSyncSwapTool];

  private static mapTool(tool: Tool): ToolDto {
    return {
      id: tool.id,
      name: tool.name,
      defaultParams: tool.defaultParams,
      ui: tool.ui,
    };
  }

  public async findOneOrFail({ where }: { where: { id: string } }) {
    const tool = this.tools.find((it) => it.id === where.id);

    if (!tool) throw new Error(`Not found tool`);

    return tool;
  }

  public async getAll() {
    return this.tools.map(ToolManager.mapTool);
  }
}
