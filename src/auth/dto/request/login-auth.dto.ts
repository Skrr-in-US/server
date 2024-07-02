import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty()
  @IsString()
  birth: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;
}
