import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class NetworkDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  rpc: string;

  @ApiProperty()
  @IsString()
  explorer: string;

  @ApiProperty()
  @IsInt()
  networkId: number;

  @ApiProperty()
  @IsInt()
  chainId: number;

  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsInt()
  decimals: number;
}

export class CreateNetworkDto extends OmitType(NetworkDto, ['id']) {}
export class UpdateNetworkDto extends OmitType(NetworkDto, ['id']) {}
