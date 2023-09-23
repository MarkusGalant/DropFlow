import { Injectable } from '@nestjs/common';

import { JsonRpcProvider, parseUnits, Wallet } from 'ethers';

import { Network, Wallet as WalletEntity } from 'src/models';

import { Tool } from '../tool.manager';

import { SyncSwap } from './syncswap';

type ParamsType = {
  swap: {
    tokenIn: string;
    tokenOut: string;
    amount: string;
  };
};

@Injectable()
export class SyncSwapLiquidityTool implements Tool {
  constructor(private network: Network) {}

  public id = `syncswap-iquidity-${this.network.chainId}`;

  public name = 'SyncSwap Liquidity';
  public icon = 'https://syncswap.xyz/images/syncswap.svg';

  public networkId = this.network.id;

  public defaultParams: ParamsType = {
    swap: {
      tokenIn: 'USDC',
      tokenOut: 'USDC',
      amount: '0.01',
    },
  };

  public ui = {
    swap: {
      options: this.network.coins.map((coin) => ({
        label: coin.symbol,
        value: coin.symbol,
      })),
    },
  };

  private getProvider = async () => {
    return new JsonRpcProvider(this.network.rpc);
  };

  public async isCompleted(_: WalletEntity, data: any): Promise<boolean> {
    const provider = await this.getProvider();

    if (!data.tx.hash) return false;

    try {
      const tx = await provider.getTransactionReceipt(data.tx.hash);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return tx && tx.status !== null && tx.status === 1;
    } catch (error) {
      return false;
    }
  }

  public async execute(wallet: WalletEntity, params: ParamsType): Promise<any> {
    const provider = await this.getProvider();

    try {
      const signer = Wallet.fromPhrase(wallet.mnemonic).connect(provider);

      const fee = await provider.getFeeData();

      const coinIn = this.network.getCoin(params.swap.tokenIn);
      const coinOut = this.network.getCoin(params.swap.tokenOut);

      const inToken = coinIn.address;
      const outToken = coinOut.address;
      const isNative = params.swap.tokenIn === 'ETH';

      const amount = parseUnits(params.swap.amount, coinIn.decimals).toString();

      const syncSwap = new SyncSwap(signer);

      const result = await syncSwap.addLiquidity(
        signer.address,
        inToken,
        outToken,
        amount,
        isNative,
        {
          gasPrice: fee.gasPrice,
        },
      );

      return {
        tx: result,
      };
    } finally {
      provider.destroy();
    }
  }
}
