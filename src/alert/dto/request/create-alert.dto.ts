import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { genderType } from 'src/user/entities/enum/genderEnum';

export class CreateAlertDto {
  sendUser: number;
  sendUserName: string;
  sendUserGrade: number;
  receiveUserName: string;

  @ApiProperty()
  @IsInt()
  receiveUser: number;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsEnum(genderType)
  gender: genderType;
}
