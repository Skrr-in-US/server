import {
  Controller,
  Post,
  Body,
  Headers,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/request/login-auth.dto';
import { CreateUserDto } from './dto/request/create-user-dto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { TokenResponse } from './dto/response/tokenResponse';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('인증/유저')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto): Promise<TokenResponse> {
    return this.authService.login(createAuthDto);
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.create(createUserDto);
  }

  @ApiOperation({ summary: '유저 정보 가져오기(인증)' })
  @UseGuards(JwtAuthGuard)
  @Get('user')
  async validate(@Req() request: any) {
    return request.user;
  }
}
