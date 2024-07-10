import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/request/create-alert.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AlertResponseDto } from './dto/response/alert-response-dto';

@ApiTags('알림')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({
    summary: '알림 생성',
    description: '새로운 알림을 생성합니다. JWT 인증이 필요합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '성공적으로 생성된 알림 객체를 반환합니다.',
    type: CreateAlertDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body()
    createAlertDto: CreateAlertDto,
    @Req() request: any
  ): Promise<CreateAlertDto> {
    return this.alertService.create(createAlertDto, request.user);
  }

  @ApiOperation({
    summary: '전체 알림 가져오기',
    description:
      '사용자에게 해당하는 모든 알림을 가져옵니다. JWT 인증이 필요합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 가져온 알림 리스트를 반환합니다.',
    type: [AlertResponseDto],
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Req() request: any): Promise<AlertResponseDto[]> {
    return this.alertService.findByUser(request.user);
  }

  @ApiOperation({
    summary: '알림(유료결제) 자세히 조회',
    description:
      '유료 결제가 필요한 알림의 자세한 정보를 조회합니다. JWT 인증이 필요합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 조회된 알림 객체를 반환합니다.',
    type: AlertResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('credit/:id')
  @ApiParam({ name: 'id', required: true, description: '알림 ID' })
  findOneByCredit(@Req() request: any, @Param('id') id: number) {
    return this.alertService.findOneByCredit(id, request.user);
  }

  @ApiOperation({
    summary: '알림 자세히 조회',
    description:
      '알림 ID를 사용하여 특정 알림의 자세한 정보를 조회합니다. JWT 인증이 필요합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '성공적으로 조회된 알림 객체를 반환합니다.',
    type: AlertResponseDto,
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없음' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: '알림 ID' })
  findOne(@Param('id') id: string): Promise<AlertResponseDto> {
    return this.alertService.findOne(+id);
  }
}
