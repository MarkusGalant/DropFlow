import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';
import { WalletGroup } from './wallet-group.model';

@Entity({ name: 'wallet' })
export class Wallet extends BaseModel {
  @Column()
  name: string;

  @Column()
  mnemonic: string;

  @Column()
  address: string;

  @Column()
  groupId: string;

  @Column()
  group: WalletGroup;
}
