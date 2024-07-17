import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AskService } from './ask.service';
import { CreateAskDto } from './dto/create-ask.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: any, @Body() createAskDto: CreateAskDto) {
    return this.askService.create(request.user, createAskDto);
  }
}
