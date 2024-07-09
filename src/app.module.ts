import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { QuestionModule } from './question/question.module';
import { AlertModule } from './alert/alert.module';
import { DatabaseModule } from './database/database';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    QuestionModule,
    AlertModule,
    DatabaseModule,
    AuthModule,
    JwtModule,
    FriendModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
