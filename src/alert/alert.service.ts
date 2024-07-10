import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/request/create-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { AlertResponseDto } from './dto/response/alert-response-dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource
  ) {}

  async create(
    createAlertDto: CreateAlertDto,
    user: User
  ): Promise<CreateAlertDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      createAlertDto.sendUser = user[0].id;
      createAlertDto.sendUserName = user[0].name;
      createAlertDto.sendUserGrade = user[0].grade;

      const receiveUser = await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder('user')
        .select('user.name')
        .where('user.id = :id', { id: createAlertDto.receiveUser })
        .getOne();

      if (!receiveUser) {
        throw new Error('Receive user not found');
      }

      createAlertDto.receiveUserName = receiveUser.name;

      const savedAlert = await queryRunner.manager
        .getRepository(Alert)
        .save(createAlertDto);

      await queryRunner.commitTransaction();
      return savedAlert;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUser(user: User): Promise<AlertResponseDto[]> {
    return AlertResponseDto.listOf(
      await this.alertRepository.find({
        select: {
          id: true,
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
          sendUserGrade: true,
        },
        where: { id },
      })
    );
    if (result && result.read === false) {
      await this.alertRepository.update(id, { read: true });
    }
    return result;
  }

  async findOneByCredit(id: number, userInfo: User) {
    // 크레딧 단위 정해지면 마이너스하기
    return await this.alertRepository.findOne({
      where: { id },
    });
  }
}
