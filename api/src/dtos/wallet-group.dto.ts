import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WalletGroupDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateWalletGroupDto {
  @ApiProperty()
  @IsString()
  name: string;
}
