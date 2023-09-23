import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';

@Entity({ name: 'network' })
export class Network extends BaseModel {
  @Column()
  shortName: string;

  @Column()
  name: string;

  @Column()
  icon: string;

  @Column()
  explorer: string;

  @Column('int')
  networkId: number;

  @Column('int')
  chainId: number;

  @Column()
  symbol: string;

  @Column('int')
  decimals: number;

  @Column()
  rpc: string;

  @Column('simple-array', { default: [] })
  coins: NetworkCoins[];

  public getCoin(symbol: string) {
    const coin = this.coins.find((it) => it.symbol === symbol);

    if (!coin) throw Error(`Not found coin ${symbol}`);

    return coin;
  }
}

export class NetworkCoins {
  @Column()
  symbol: string;

  @Column()
  address: string;

  @Column()
  decimals: number;
}
