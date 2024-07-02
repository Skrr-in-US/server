import { Expose } from '@nestjs/class-transformer';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/user/entities/user.entity';

export class UserInfoResponseDto {
  @Expose()
  id: number;

  @Expose()
  school: string;

  @Expose()
  grade: number;

  @Expose()
  name: string;

  @Expose()
  gender: string;

  @Expose()
  birth: string;

  @Expose()
  role: string;

  static of(user: User): UserInfoResponseDto {
    return plainToInstance(UserInfoResponseDto, user);
  }
}
