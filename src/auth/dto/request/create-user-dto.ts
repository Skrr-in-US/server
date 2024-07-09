import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { genderType } from 'src/user/entities/enum/genderEnum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  school: string;

  @ApiProperty()
  @IsNumber()
  grade: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(genderType)
  gender: genderType;

  @ApiProperty()
  @IsNumber()
  age: number;

  @ApiProperty()
  @IsString()
  password: string;
}
