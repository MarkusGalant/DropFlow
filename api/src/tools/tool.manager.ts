import { Injectable } from '@nestjs/common';

import { Wallet } from 'src/models';
import { NetworkService } from 'src/services';

import { SyncSwapSwapTool } from './syncswap/syncswap.swap.tool';
import { SyncSwapLiquidityTool } from './syncswap/syncswap.liquidity.tool';

export type Tool = {
  id: string;
  name: string;
  icon: string;
  networkId: string;
  defaultParams: any;
  ui: any;
  execute(wallet: Wallet, params: any): Promise<any>;
  isCompleted(wallet: Wallet, result: any): Promise<boolean>;
};

@Injectable()
export class ToolManager {
  constructor(private networkService: NetworkService) {}

  public getAll = async (): Promise<Tool[]> => {
    const zkSync = await this.networkService.getOneByChainId(324);

    return [new SyncSwapSwapTool(zkSync), new SyncSwapLiquidityTool(zkSync)];
  };

  public async findOneOrFail({ where }: { where: { id: string } }) {
    const tools = await this.getAll();
    const tool = tools.find((it) => it.id === where.id);

    if (!tool) throw new Error(`Not found tool`);

    return tool;
  }
}
