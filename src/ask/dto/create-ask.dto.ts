import { IsString } from 'class-validator';

export class CreateAskDto {
  userId: number;

  @IsString()
  content: string;
}
