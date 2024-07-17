import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @ApiProperty()
  logo: string;

  @IsString()
  @ApiProperty()
  school: string;

  @IsString()
  @ApiProperty()
  county: string;

  @IsString()
  @ApiProperty()
  state: string;

  @IsNumber()
  @ApiProperty()
  people: number;
}
