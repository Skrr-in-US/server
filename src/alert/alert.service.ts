import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly authService: AuthService
  ) {}
  async create(
    createAlertDto: CreateAlertDto,
    token: string
  ): Promise<CreateAlertDto> {
    const userInfo = await this.authService.validate(token);
    createAlertDto.sendUser = userInfo.id;
    return await this.alertRepository.save(createAlertDto);
  }

  async findByUser(token: string) {
    const userInfo = await this.authService.validate(token);
    return this.alertRepository.find({ where: { receiveUser: userInfo.id } });
  }

  async findOne(id: number, token: string) {
    const result = this.alertRepository.find({ where: { id } });
  }
}
