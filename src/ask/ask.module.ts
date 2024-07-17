import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ask } from './entities/ask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ask])],
  controllers: [AskController],
  providers: [AskService, JwtService, UserService],
})
export class AskModule {}
