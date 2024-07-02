import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  controllers: [QuestionController],
  providers: [QuestionService, AuthService, JwtService, UserService],
})
export class QuestionModule {}
