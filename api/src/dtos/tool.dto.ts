import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class ToolDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  networkId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsObject()
  defaultParams: any;

  @ApiProperty()
  @IsObject()
  ui: any;
}
