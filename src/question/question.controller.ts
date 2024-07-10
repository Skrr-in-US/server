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
  ApiResponse,
} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

@ApiTags('질문')
@ApiBearerAuth()
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({
    summary: '질문 만들기(어드민 전용)',
    description: '새로운 질문을 생성합니다. 어드민 권한이 필요합니다.',
  })
  @ApiBody({
    description: '질문 생성에 필요한 데이터',
    type: CreateQuestionDto,
  })
  @ApiResponse({
    status: 201,
    description: '성공적으로 생성된 질문 객체를 반환합니다.',
    type: CreateQuestionDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: any, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto, request.user);
  }

  @ApiOperation({
    summary: '질문 & 선택할 유저 가져오기',
    description:
      '질문 및 선택할 유저 목록을 가져옵니다. 제외할 사용자의 ID를 쿼리 파라미터로 전달할 수 있습니다.',
  })
  @ApiQuery({
    name: 'except',
    required: false,
    description: '제외할 사용자의 ID (쉼표로 구분된 문자열)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 조회된 질문 및 유저 목록을 반환합니다.',
    type: Object,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findQuestion(@Req() request: any, @Query('except') except: string) {
    return this.questionService.findQuestion(except, request.user);
  }

  @ApiOperation({
    summary: '질문 업데이트(어드민용)',
    description: '기존 질문을 업데이트합니다. 어드민 권한이 필요합니다.',
  })
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
  @ApiResponse({
    status: 200,
    description: '성공적으로 업데이트된 질문 객체를 반환합니다.',
    type: UpdateQuestionDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
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

  @ApiOperation({
    summary: '유저 셔플',
    description: '유저 목록을 셔플하여 반환합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 셔플된 유저 목록을 반환합니다.',
    type: [User],
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @UseGuards(JwtAuthGuard)
  @Get('shuffle')
  shuffle(@Req() request: any) {
    console.log(request.user);
    return this.questionService.shuffle(request.user);
  }

  @ApiOperation({
    summary: '질문 삭제(어드민용)',
    description: '기존 질문을 삭제합니다. 어드민 권한이 필요합니다.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '삭제할 질문의 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 삭제된 질문 객체를 반환합니다.',
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    return this.questionService.remove(+id, request.user[0].role);
  }
}
