import { IsNumber } from 'class-validator';

export class CreateFriendDto {
  @IsNumber()
  friend_id: number;

  user_id: number;
}
