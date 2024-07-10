import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/request/create-question.dto';
import { UpdateQuestionDto } from './dto/request/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
    user: User
  ): Promise<CreateQuestionDto> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (user[0].role !== 'admin') {
        throw new UnauthorizedException('권한이 없습니다.');
      }

      const savedQuestion = await queryRunner.manager
        .getRepository(Question)
        .save(createQuestionDto);

      await queryRunner.commitTransaction();
      return savedQuestion;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto, role: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (role !== 'admin') {
        throw new UnauthorizedException('admin이 아닙니다.');
      }

      const updateResult = await queryRunner.manager
        .getRepository(Question)
        .update(id, updateQuestionDto);

      await queryRunner.commitTransaction();
      return updateResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, role: string) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (role !== 'admin') {
        throw new UnauthorizedException('admin이 아닙니다.');
      }

      const deleteResult = await queryRunner.manager
        .getRepository(Question)
        .delete(id);

      await queryRunner.commitTransaction();
      return deleteResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findQuestion(except: string, userInfo: User) {
    let excludedIds: number[] = [];
    if (except) {
      excludedIds = except
        .split(',')
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
    }

    const question = await this.questionRepository
      .createQueryBuilder('question')
      .where(
        excludedIds.length > 0 ? 'question.id NOT IN (:...excludedIds)' : '1=1',
        { excludedIds }
      )
      .orderBy('RAND()')
      .getOne();

    const users = await this.userService.findUser(userInfo[0]);

    return { question, users };
  }

  async shuffle(userInfo: User) {
    return await this.userService.findUser(userInfo[0]);
  }
}
