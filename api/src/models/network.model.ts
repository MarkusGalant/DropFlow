import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';

@Entity({ name: 'network' })
export class Network extends BaseModel {
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
}
