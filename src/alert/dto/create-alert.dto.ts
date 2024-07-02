import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { genderType } from 'src/user/entities/enum/genderEnum';

export class CreateAlertDto {
  sendUser: number;

  @ApiProperty()
  @IsInt()
  receiveUser: number;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsEnum(genderType)
  gender: genderType;
}
