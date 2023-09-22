import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class WalletDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  groupId: string;
}

export class ImportWalletsDto {
  @ApiProperty()
  @IsString()
  groupId: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  mnemonics: string[];
}
