import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { WalletService } from '../services/wallet.service';

import {
  ImportWalletsDto,
  WalletDto,
  WalletGroupDto,
  CreateWalletGroupDto,
} from '../dtos';
import {} from 'src/dtos/wallet-group.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @HttpCode(200)
  @ApiOkResponse({ type: [WalletDto] })
  async getAll() {
    return await this.walletService.getAll();
  }

  @Get('/groups')
  @HttpCode(200)
  @ApiOkResponse({ type: [WalletGroupDto] })
  async getAllGroups() {
    return await this.walletService.getAllGroups();
  }

  @Post('/groups')
  @HttpCode(201)
  @ApiOkResponse()
  async createGroup(@Body() body: CreateWalletGroupDto) {
    return await this.walletService.createGroup(body);
  }

  @Post('/import')
  @HttpCode(201)
  @ApiOkResponse()
  async import(@Body() body: ImportWalletsDto) {
    return await this.walletService.import(body);
  }
}
