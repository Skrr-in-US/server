const dotenv = require('dotenv');
dotenv.config();
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from 'src/alert/entities/alert.entity';
import { Ask } from 'src/ask/entities/ask.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { Question } from 'src/question/entities/question.entity';
import { School } from 'src/school/entities/school.entity';
import { User } from 'src/user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      synchronize: true,
      entities: [User, Question, Alert, Friend, Ask, School],
    }),
  ],
})
export class DatabaseModule {}
