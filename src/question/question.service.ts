import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/request/create-question.dto';
import { UpdateQuestionDto } from './dto/request/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Not, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  async create(
    createQuestionDto: CreateQuestionDto,
    token: string
  ): Promise<CreateQuestionDto> {
    const userInfo = await this.authService.validate(token);
    if (userInfo.role != 'admin')
      throw new UnauthorizedException('권한이 없습니다.');

    return this.questionRepository.save(createQuestionDto);
  }

  async findQuestion(token: string, except: string) {
    const userInfo = await this.authService.validate(token);

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

    const users = await this.userService.findUser(userInfo);

    return { question, users };
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
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
