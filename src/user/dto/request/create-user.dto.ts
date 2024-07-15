import { IsEnum, IsNumber, IsString } from 'class-validator';
import { genderType } from '../../entities/enum/genderEnum';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  school: string;

  @IsNumber()
  grade: number;

  @IsString()
  name: string;

  @IsEnum(genderType)
  gender: genderType;

  @IsString()
  birth: string;

  @IsString()
  password: string;

  @IsString()
  fcd: string;
}
