import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/request/create-question.dto';
import { UpdateQuestionDto } from './dto/request/update-question.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('질문')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: '질문 만들기(어드민 전용)' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: any, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, request.user);
  }

  // @Get('first') // 필요하면쓰기
  // findQuestions(@Headers('Authorization') token: string) {
  //   return this.questionService.findQuestions(token);
  // }

  @ApiOperation({ summary: '질문 & 선택할 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findQuestion(
    @Req() request: any,
    @Headers('Authorization') token: string,
    @Query('except') except: string
  ) {
    return this.questionService.findQuestion(except, request.user);
  }

  @ApiOperation({ summary: '질문 업데이트(어드민용)' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Req() request: any,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionService.update(
      +id,
      updateQuestionDto,
      request.user[0].role
    );
  }

  @ApiOperation({ summary: '질문 삭제(어드민용)' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    return this.questionService.remove(+id, request.user[0].role);
  }
}
