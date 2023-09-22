import { MongoRepository } from 'typeorm';
import { ethers } from 'ethers';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Wallet, WalletGroup } from 'src/models';
import {
  ImportWalletsDto,
  WalletDto,
  CreateWalletGroupDto,
  WalletGroupDto,
} from 'src/dtos';
import { createId } from 'src/utils';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: MongoRepository<Wallet>,
    @InjectRepository(WalletGroup)
    private walletGroupRepository: MongoRepository<WalletGroup>,
    private eventEmitter: EventEmitter2,
  ) {}

  private static mapWallet(wallet: Wallet): WalletDto {
    return {
      id: wallet.id,
      name: wallet.name,
      groupId: wallet.groupId,
      address: wallet.address,
    };
  }

  private static mapWalletGroup(walletGroup: WalletGroup): WalletGroupDto {
    return {
      id: walletGroup.id,
      name: walletGroup.name,
    };
  }

  public async getAll(): Promise<WalletDto[]> {
    const wallets = await this.walletRepository.find();

    return wallets.map(WalletService.mapWallet);
  }

  public async getAllGroups(): Promise<WalletGroupDto[]> {
    const wallets = await this.walletGroupRepository.find();

    return wallets.map(WalletService.mapWalletGroup);
  }

  public async createGroup(data: CreateWalletGroupDto) {
    const entity = this.walletGroupRepository.create({
      id: createId(),
      name: data.name,
    });

    const result = await this.walletGroupRepository.save(entity);

    this.eventEmitter.emit('wallet-group.imported', result);

    return {
      id: result.id,
    };
  }

  public async import(data: ImportWalletsDto) {
    const count = await this.walletRepository.count({
      groupId: data.groupId,
    });

    const group = await this.walletGroupRepository.findOneOrFail({
      where: { id: data.groupId },
    });

    const existing = await this.walletRepository.find({
      where: {
        $or: data.mnemonics.map((mnemonic) => ({
          groupId: data.groupId,
          address: ethers.Wallet.fromPhrase(mnemonic).address,
        })),
      },
    });

    const entities = data.mnemonics
      .map((mnemonic, i) =>
        this.walletRepository.create({
          id: createId(),
          name: `${group.name.toLowerCase()}-${i + count + 1}`,
          groupId: data.groupId,
          mnemonic: mnemonic,
          address: ethers.Wallet.fromPhrase(mnemonic).address,
        }),
      )
      .filter(({ address }) => !existing.some((e) => e.address === address));

    const result = await this.walletRepository.save(entities);

    this.eventEmitter.emit('wallets.imported', result);
  }
}
