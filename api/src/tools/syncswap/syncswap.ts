import { Contract, AbiCoder, ContractRunner } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';

import CLASSIC_POOL_ABI from './abi/syncswap/classic-pool.json';
import CLASSIC_POOL_DATA_ABI from './abi/syncswap/classic-pool-data.json';
import ROUTER_ABI from './abi/syncswap/router.json';

const ZERO_ADDRESS = '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91';
const CLASSIC_POOL_ADDRESS = '0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb';
const ROUTER_ADDRESS = '0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295';

const slippage = 1;

export class SyncSwap {
  private router: Contract;
  private classicPoolFactory: Contract;

  constructor(private runner: ContractRunner) {
    this.classicPoolFactory = new Contract(
      CLASSIC_POOL_ADDRESS,
      CLASSIC_POOL_ABI,
      runner,
    );
    this.router = new Contract(ROUTER_ADDRESS, ROUTER_ABI, runner);
  }
  private getPoolAddress = async (inToken: string, outToken: string) => {
    return await this.classicPoolFactory.getPool(inToken, outToken);
  };

  private getDeadline = async (seconds: number) => {
    return Promise.resolve(
      BigNumber.from(Math.floor(Date.now() / 1000)).add(seconds),
    );
  };

  private getAmount = async (
    poolAddress: string,
    tokenAddress: string,
    userAddress: string,
    amount: string,
  ) => {
    const classicPoolFactory: Contract = new Contract(
      poolAddress,
      CLASSIC_POOL_DATA_ABI,
      this.runner,
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

  public swap = async (
    address: string,
    inToken: string,
    outToken: string,
    amount: string,
    isNative: boolean,
    tx: any,
  ) => {
    // The factory of the Classic Pool.

    const poolAddress: string = await this.getPoolAddress(inToken, outToken);

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

    const deadline = await this.getDeadline(60 * 60);
    const minAmountOut = await this.getAmount(
      poolAddress,
      inToken,
      address,
      BigNumber.from(amount).toString(),
    );

    const response = await this.router.swap(
      paths, // paths
      minAmountOut.toString(), // amountOutMin // Note: ensures slippage here
      deadline.toString(), // deadline // 30 minutes
      tx,
    );

    return response;
  };

  public async addLiquidity(
    address: string,
    inToken: string,
    outToken: string,
    amount: string,
    isNative: boolean,
    tx,
  ) {
    const poolAddress = await this.getPoolAddress(inToken, outToken);

    const response = await this.router.addLiquidity2(
      poolAddress,
      [
        [isNative ? ZERO_ADDRESS : inToken, amount],
        [outToken, 0],
      ],
      new AbiCoder().encode(['address'], [address]),
      0,
      ZERO_ADDRESS,
      '0x',
      tx,
    );

    return response;
  }
}
