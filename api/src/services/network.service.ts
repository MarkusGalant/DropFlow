import { MongoRepository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Network } from 'src/models';
import { NetworkDto, CreateNetworkDto, UpdateNetworkDto } from 'src/dtos';
import { createId } from 'src/utils';

@Injectable()
export class NetworkService {
  constructor(
    @InjectRepository(Network)
    private networkRepository: MongoRepository<Network>,
    private eventEmitter: EventEmitter2,
  ) {}

  private static mapNetwork(network: Network): NetworkDto {
    return network;
  }

  public async getAll(): Promise<NetworkDto[]> {
    const networks = await this.networkRepository.find();

    return networks.map(NetworkService.mapNetwork);
  }

  public async getOneByChainId(chainId: number): Promise<Network> {
    const network = await this.networkRepository.findOneOrFail({
      where: { chainId },
    });

    return network;
  }
  public async getOneByName(name: string): Promise<Network> {
    const network = await this.networkRepository.findOneOrFail({
      where: { name },
    });

    return network;
  }

  public async createOne(data: CreateNetworkDto) {
    const entity = this.networkRepository.create({
      id: createId(),
      ...data,
    });

    const result = await this.networkRepository.save(entity);

    this.eventEmitter.emit('network.created', result);

    return { id: result.id };
  }

  public async updateOne(networkId: string, data: UpdateNetworkDto) {
    const entity = await this.networkRepository.findOneOrFail({
      where: { id: networkId },
    });

    this.networkRepository.merge(entity, data);

    const result = await this.networkRepository.save(entity);

    this.eventEmitter.emit('network.updated', result);
  }
}
