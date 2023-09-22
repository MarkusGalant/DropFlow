import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';
import { Wallet } from './wallet.model';

@Entity({ name: 'wallet-group' })
export class WalletGroup extends BaseModel {
  @Column()
  name: string;

  @Column()
  wallets: Wallet[];
}
