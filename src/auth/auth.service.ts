import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/request/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/request/create-user-dto';
import { JwtService } from '@nestjs/jwt';
import { UserInfoResponseDto } from './dto/response/userInfo-response-dto';
import { TokenResponse } from './dto/response/tokenResponse';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<TokenResponse> {
    const { age, name, password } = loginAuthDto;

    const userInfo = await this.userRepository.find({ where: { age, name } });
    if (userInfo.length === 0)
      throw new UnauthorizedException('유저 정보가 일치하지 않습니다.');
    const isUser = await bcrypt.compare(password, userInfo[0].password);

    if (isUser) return this.getToken(userInfo[0].id);
    throw new UnauthorizedException('유저 정보가 일치하지 않습니다.');
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      +process.env.SALTHASH
    );
    return await this.userRepository.save(createUserDto);
  }

  async getToken(id: number): Promise<TokenResponse> {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.SECRET_KEY,
      algorithm: 'HS256',
      expiresIn: '9900h',
    });

    return TokenResponse.of(token);
  }

  async validate(token: string): Promise<UserInfoResponseDto> {
    const replacedToken = token.replace('Bearer ', '');
    const validatedToken = this.jwtService.verify(replacedToken, {
      secret: process.env.SECRET_KEY,
    });

    const user = await this.userRepository.findOne({
      select: {
        id: true,
        school: true,
        grade: true,
        name: true,
        gender: true,
        age: true,
        role: true,
      },
      where: { id: validatedToken.id },
    });

    return UserInfoResponseDto.of(user);
  }

  async updateToken(user: User, fcd: string) {
    return await this.userRepository.update(user[0].id, { fcd });
  }
}
