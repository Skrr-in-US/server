import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/request/create-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';
import { AlertResponseDto } from './dto/response/alert-response-dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(
    createAlertDto: CreateAlertDto,
    user: User
  ): Promise<CreateAlertDto> {
    createAlertDto.sendUser = user[0].id;
    createAlertDto.sendUserName = user[0].name;
    const receiveUser = await this.userRepository
      .createQueryBuilder('user')
      .select('user.name')
      .where('user.id = :id', { id: createAlertDto.receiveUser })
      .getOne();
    createAlertDto.receiveUserName = receiveUser.name;
    return await this.alertRepository.save(createAlertDto);
  }

  async findByUser(user: User): Promise<AlertResponseDto[]> {
    return AlertResponseDto.listOf(
      await this.alertRepository.find({
        select: {
          id: true,
          question: true,
          summary: true,
          read: true,
          gender: true,
        },
        where: { receiveUser: user[0].id },
      })
    );
  }

  async findOne(id: number): Promise<AlertResponseDto> {
    const result = AlertResponseDto.of(
      await this.alertRepository.findOne({
        select: {
          id: true,
          receiveUser: true,
          receiveUserName: true,
          question: true,
          summary: true,
          read: true,
          gender: true,
        },
        where: { id },
      })
    );
    if (result && result.read === false) {
      await this.alertRepository.update(id, { read: true });
    }
    return result;
  }
}
