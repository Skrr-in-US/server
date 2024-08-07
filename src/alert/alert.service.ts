const dotenv = require('dotenv');
dotenv.config();
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/request/create-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { AlertResponseDto } from './dto/response/alert-response-dto';
import { User } from 'src/user/entities/user.entity';
import { join } from 'path';
const admin = require('firebase-admin');
@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource
  ) {
    const serviceAccount = require(
      join(
        __dirname,
        '..',
        '..',
        'skrr-us-firebase-adminsdk-v73y5-89a8526ae2.json'
      )
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  async sendPushNotification(id: number, question: string) {
    const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const receiveUserFCD = await this.userRepository.find({
      select: { fcd: true },
      where: { id },
    });

    const payload = {
      notification: {
        title: 'Someone voted for you',
        body: capitalizeFirstLetter(question),
      },
      token: receiveUserFCD[0].fcd,
    };
    try {
      const response = await admin.messaging().send(payload);
      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return;
    }
  }

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
        .select(['user.name', 'user.id'])
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
      this.sendPushNotification(receiveUser.id, createAlertDto.question);
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
        order: { id: 'desc' },
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
          paid: true,
        },
        where: { id },
      })
    );
    if (result && result.read === false) {
      await this.alertRepository.update(id, { read: true });
    }
    return result;
  }

  async findOneByCredit(id: number, userInfo: User): Promise<Alert | number> {
    const queryRunner =
      this.alertRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.findOne(Alert, {
        where: { id },
      });
      if (result && result.paid === false) {
        if (userInfo[0].token === 0) {
          await queryRunner.rollbackTransaction();
          return HttpStatus.PAYMENT_REQUIRED;
        }
        userInfo[0].token = userInfo[0].token - 1;
        await queryRunner.manager.update(User, userInfo[0].id, {
          token: userInfo[0].token,
        });
        await queryRunner.manager.update(Alert, id, { paid: true });
        result.paid = true;
      }

      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
