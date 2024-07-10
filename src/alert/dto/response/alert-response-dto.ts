import { Expose, plainToInstance } from 'class-transformer';

export class AlertResponseDto {
  @Expose()
  id: number;

  @Expose()
  receiveUser: number;

  @Expose()
  receiveUserName: string;

  @Expose()
  sendUser: number;

  @Expose()
  summary: string;

  @Expose()
  read: boolean;

  @Expose()
  gender: string;

  static listOf(alerts: AlertResponseDto[]): AlertResponseDto[] {
    return plainToInstance(AlertResponseDto, alerts);
  }

  static of(alert: AlertResponseDto): AlertResponseDto {
    return plainToInstance(AlertResponseDto, alert);
  }
}
