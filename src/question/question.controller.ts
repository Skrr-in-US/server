import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  Put,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/request/create-question.dto';
import { UpdateQuestionDto } from './dto/request/update-question.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('질문')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: '질문 만들기(어드민 전용)' })
  @ApiBody({
    description: '질문 생성에 필요한 데이터',
    type: CreateQuestionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: any, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, request.user);
  }

  @ApiOperation({ summary: '질문 & 선택할 유저 가져오기' })
  @ApiQuery({
    name: 'except',
    required: false,
    description: '제외할 사용자의 ID (쉼표로 구분된 문자열)',
    type: String,
  })
  @ApiBody({
    description: '사용자 인증 토큰',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  findQuestion(@Req() request: any, @Query('except') except: string) {
    return this.questionService.findQuestion(except, request.user);
  }

  @ApiOperation({ summary: '질문 업데이트(어드민용)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '업데이트할 질문의 ID',
    type: String,
  })
  @ApiBody({
    description: '질문 업데이트에 필요한 데이터',
    type: UpdateQuestionDto,
  })
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

  @ApiOperation({ summary: '유저 셔플' })
  @UseGuards(JwtAuthGuard)
  @Get('shuffle')
  shuffle(@Req() request: any) {
    console.log(request.user);
    return this.questionService.shuffle(request.user);
  }

  @ApiOperation({ summary: '질문 삭제(어드민용)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 질문의 ID',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    return this.questionService.remove(+id, request.user[0].role);
  }
}
