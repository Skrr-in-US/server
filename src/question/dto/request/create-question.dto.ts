import { ApiProperty } from '@nestjs/swagger';
import { IsString, isEmpty } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  imoji: string;
}
