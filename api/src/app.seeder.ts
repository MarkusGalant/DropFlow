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
        coins: [],
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
        coins: [
          {
            symbol: 'ETH',
            address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
            decimals: 18,
          },
          {
            symbol: 'WETH',
            address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
            decimals: 18,
          },
          {
            symbol: 'USDC',
            address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
            decimals: 6,
          },
          {
            symbol: 'USDT',
            address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
            decimals: 6,
          },
          {
            symbol: 'BUSD',
            address: '0x2039bb4116b4efc145ec4f0e2ea75012d6c0f181',
            decimals: 18,
          },
          {
            symbol: 'MATIC',
            address: '0x28a487240e4d45cff4a2980d334cc933b7483842',
            decimals: 18,
          },
          {
            symbol: 'OT',
            address: '0xd0ea21ba66b67be636de1ec4bd9696eb8c61e9aa',
            decimals: 18,
          },
          {
            symbol: 'MAV',
            address: '0x787c09494ec8bcb24dcaf8659e7d5d69979ee508',
            decimals: 18,
          },
          {
            symbol: 'WBTC',
            address: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
            decimals: 6,
          },
        ],
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
            toolId: 'syncswap-swap-324',
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
