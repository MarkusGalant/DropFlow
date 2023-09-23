import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import { Network, WalletGroup, Workflow } from './models';
import { createId } from './utils';

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    @InjectRepository(Network)
    private networkRepository: MongoRepository<Network>,
    @InjectRepository(Workflow)
    private workflowRepository: MongoRepository<Workflow>,

    @InjectRepository(WalletGroup)
    private walletGroupRepository: MongoRepository<WalletGroup>,
  ) {}

  async seed() {
    await this.networks()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding networks...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding networks...');
        Promise.reject(error);
      });

    await this.workflows()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding workflows...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding workflows...');
        Promise.reject(error);
      });

    await this.walletGroups()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding wallet groups...');
        Promise.resolve(completed);
      })
      .catch((error) => {
        this.logger.error('Failed seeding wallet groups...');
        Promise.reject(error);
      });
  }

  async networks() {
    const networks = [
      {
        id: createId(),
        name: 'Ethereum Mainnet',
        icon: 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
        explorer: 'https://etherscan.io',
        networkId: 1,
        chainId: 1,
        symbol: 'ETH',
        decimals: 18,
        rpc: 'https://eth.llamarpc.com',
      },
      {
        id: createId(),
        name: 'zkSync Era Mainnet',
        icon: 'https://icons.llamao.fi/icons/chains/rsz_zksync-era.jpg',
        explorer: 'https://explorer.zksync.io',
        networkId: 324,
        chainId: 324,
        symbol: 'ETH',
        decimals: 18,
        rpc: 'https://mainnet.era.zksync.io',
      },
    ];

    for (const network of networks) {
      const exist = await this.networkRepository.findOne({
        where: { name: network.name },
      });

      if (!exist) {
        await this.networkRepository.save(network);
      }
    }
  }

  async workflows() {
    const workflows = [
      {
        id: createId(),
        name: 'Demo Workflow',
        description: '',
        steps: [
          {
            id: '1695415126761',
            toolId: 'zksync-syncswap',
            params: {
              swap: {
                tokenIn: 'USDC',
                tokenOut: 'USDT',
                amount: '0.01',
              },
            },
          },
        ],
      },
    ];

    for (const workflow of workflows) {
      const exist = await this.workflowRepository.findOne({
        where: { name: workflow.name },
      });

      if (!exist) {
        await this.workflowRepository.save(workflow);
      }
    }
  }

  async walletGroups() {
    const walletGroups = [
      {
        id: createId(),
        name: 'Test Group',
      },
    ];

    for (const walletGroup of walletGroups) {
      const exist = await this.walletGroupRepository.findOne({
        where: { name: walletGroup.name },
      });

      if (!exist) {
        await this.walletGroupRepository.save(walletGroup);
      }
    }
  }
}
