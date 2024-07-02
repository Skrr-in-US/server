import { Expose, plainToInstance } from 'class-transformer';

export class TokenResponse {
  @Expose()
  token: string;

  static of(token: string): TokenResponse {
    return plainToInstance(TokenResponse, token);
  }
}
