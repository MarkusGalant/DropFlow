import { JsonRpcProvider, parseUnits, Wallet } from 'ethers';
import { Contract, AbiCoder, ContractRunner, getAddress } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

import CLASSIC_POOL_ABI from './../abi/syncswap/classic-pool.json';
import CLASSIC_POOL_DATA_ABI from './../abi/syncswap/classic-pool-data.json';
import ROUTER_ABI from './../abi/syncswap/router.json';

import { Wallet as WalletEntity } from './../models';
import { NetworkService } from 'src/services';
import { Injectable } from '@nestjs/common';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const CLASSIC_POOL_ADDRESS = '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb';
const ROUTER_ADDRESS = '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295';

const slippage = 1;

const TOKENS = {
  ETH: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
  WETH: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
  USDC: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
  USDT: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
  BUSD: '0x2039bb4116b4efc145ec4f0e2ea75012d6c0f181',
  MATIC: '0x28a487240e4d45cff4a2980d334cc933b7483842',
  OT: '0xd0ea21ba66b67be636de1ec4bd9696eb8c61e9aa',
  MAV: '0x787c09494ec8bcb24dcaf8659e7d5d69979ee508',
  WBTC: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
};

const DECIMALS = {
  ETH: 18,
  WETH: 18,
  USDC: 6,
  USDT: 6,
  BUSD: 18,
  MATIC: 18,
  OT: 18,
  MAV: 18,
  WBTC: 8,
};

type ParamsType = {
  swap: {
    tokenIn: string;
    tokenOut: string;
    amount: string;
  };
};

@Injectable()
export class ZkSYncSyncSwapTool {
  constructor(private readonly networkService: NetworkService) {}

  public id = 'zksync-syncswap';

  public name = 'zkSync - SyncSwap';

  public defaultParams: ParamsType = {
    swap: {
      tokenIn: 'USDC',
      tokenOut: 'USDC',
      amount: '0.01',
    },
  };

  public ui = {
    swap: {
      options: Object.keys(TOKENS).map((token) => ({
        label: token,
        value: token,
      })),
    },
  };

  private getProvider = async () => {
    const network =
      await this.networkService.getOneByName('zkSync Era Mainnet');

    return new JsonRpcProvider(network.rpc);
  };

  private getDeadline = async (seconds: number) => {
    return Promise.resolve(
      BigNumber.from(Math.floor(Date.now() / 1000)).add(seconds),
    );
  };

  private getAmount = async (
    runner: ContractRunner,
    poolAddress: string,
    tokenAddress: string,
    userAddress: string,
    amount: string,
  ) => {
    const classicPoolFactory: Contract = new Contract(
      poolAddress,
      CLASSIC_POOL_DATA_ABI,
      runner,
    );

    const minAmountOut: BigNumber = await classicPoolFactory.getAmountOut(
      tokenAddress,
      amount,
      userAddress,
    );

    return BigNumber.from(minAmountOut).sub(
      BigNumber.from(minAmountOut).div(100).mul(slippage),
    );
  };

  private swap = async (
    runner: ContractRunner,
    address: string,
    inToken: string,
    outToken: string,
    amount: string,
    isNative: boolean,
    tx: any,
  ) => {
    // The factory of the Classic Pool.
    const classicPoolFactory: Contract = new Contract(
      CLASSIC_POOL_ADDRESS,
      CLASSIC_POOL_ABI,
      runner,
    );

    const poolAddress: string = await classicPoolFactory.getPool(
      inToken,
      outToken,
      runner,
    );

    // Checks whether the pool exists.
    if (poolAddress === ZERO_ADDRESS) {
      throw Error('Pool not exists');
    }

    const swapData: string = new AbiCoder().encode(
      ['address', 'address', 'uint8'],
      [inToken, address, 1], // tokenIn, to, withdraw mode
    );

    // We have only 1 step.
    const steps = [
      {
        pool: poolAddress,
        data: swapData,
        callback: ZERO_ADDRESS,
        callbackData: '0x',
      },
    ];

    const paths = [
      {
        steps: steps,
        tokenIn: isNative ? ZERO_ADDRESS : inToken,
        amountIn: BigNumber.from(amount).toString(),
      },
    ];

    const router: Contract = new Contract(ROUTER_ADDRESS, ROUTER_ABI, runner);

    const deadline = await this.getDeadline(60 * 60);
    const minAmountOut = await this.getAmount(
      runner,
      poolAddress,
      inToken,
      address,
      BigNumber.from(amount).toString(),
    );

    const response = await router.swap(
      paths, // paths
      minAmountOut.toString(), // amountOutMin // Note: ensures slippage here
      deadline.toString(), // deadline // 30 minutes
      tx,
    );

    return response;
  };

  public async isCompleted(wallet: WalletEntity, data: any): Promise<boolean> {
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

      const inToken = getAddress(TOKENS[params.swap.tokenIn]);
      const outToken = getAddress(TOKENS[params.swap.tokenOut]);
      const amount = parseUnits(
        params.swap.amount,
        DECIMALS[params.swap.tokenIn],
      ).toString();
      const isNative = params.swap.tokenIn === 'ETH';

      const result = await this.swap(
        signer,
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
