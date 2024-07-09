import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/request/create-question.dto';
import { UpdateQuestionDto } from './dto/request/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly userService: UserService
  ) {}
  async create(
    createQuestionDto: CreateQuestionDto,
    user: User
  ): Promise<CreateQuestionDto> {
    if (user[0].role != 'admin')
      throw new UnauthorizedException('권한이 없습니다.');

    return this.questionRepository.save(createQuestionDto);
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

  async update(id: number, updateQuestionDto: UpdateQuestionDto, role: string) {
    console.log(role);
    if (role === 'admin') {
      return await this.questionRepository.update(id, updateQuestionDto);
    }
    throw new UnauthorizedException('admin이 아닙니다.');
  }

  async remove(id: number, role: string) {
    if (role === 'admin') {
      return await this.questionRepository.delete(id);
    }
    throw new UnauthorizedException('admin이 아닙니다.');
  }

  // async findQuestions(token: string) {
  //   const userInfo = await this.authService.validate(token);
  //   const question = this.questionRepository
  //     .createQueryBuilder('question')
  //     .orderBy('RAND()')
  //     .limit(2).getMany;

  //   const user = await this.userService.findUser(userInfo);

  //   return { question, user };
  // }
}
