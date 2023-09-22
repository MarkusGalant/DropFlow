import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { NetworkService } from '../services/network.service';

import { CreateNetworkDto, NetworkDto, UpdateNetworkDto } from '../dtos';

@Controller('networks')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: [NetworkDto] })
  async getAll() {
    return await this.networkService.getAll();
  }

  @Post()
  @HttpCode(201)
  @ApiOkResponse()
  async createOne(@Body() body: CreateNetworkDto) {
    return await this.networkService.createOne(body);
  }

  @Put('/:networkId')
  @HttpCode(200)
  @ApiOkResponse()
  async updateOne(
    @Param('networkId') networkId: string,
    @Body() body: UpdateNetworkDto,
  ) {
    return await this.networkService.updateOne(networkId, body);
  }
}
