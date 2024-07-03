import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/request/create-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { AlertResponseDto } from './dto/response/alert-response-dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly authService: AuthService
  ) {}
  async create(
    createAlertDto: CreateAlertDto,
    user: User
  ): Promise<CreateAlertDto> {
    createAlertDto.sendUser = user[0].id;
    return await this.alertRepository.save(createAlertDto);
  }

  async findByUser(user: User): Promise<AlertResponseDto[]> {
    return AlertResponseDto.listOf(
      await this.alertRepository.find({ where: { receiveUser: user[0].id } })
    );
  }

  async findOne(id: number): Promise<AlertResponseDto> {
    const result = AlertResponseDto.of(
      await this.alertRepository.findOne({
        where: { id },
      })
    );
    if (result && result.read === false) {
      await this.alertRepository.update(id, { read: true });
    }
    return result;
  }
}
