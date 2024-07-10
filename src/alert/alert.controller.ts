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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AlertResponseDto } from './dto/response/alert-response-dto';

@ApiTags('알림')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({ summary: '알림 생성' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createAlertDto: CreateAlertDto,
    @Req() request: any
  ): Promise<CreateAlertDto> {
    return this.alertService.create(createAlertDto, request.user);
  }

  @ApiOperation({ summary: '전체 알림 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Req() request: any): Promise<AlertResponseDto[]> {
    return this.alertService.findByUser(request.user);
  }

  //   @ApiOperation({summary: '알림(유료결제) 자세히 조회'})
  //   @UseGuards(JwtAuthGuard)
  //   @Get()
  // findOneByCredit(@Req() request: any){
  //   return this.alertService.findOneByCredit(request.)
  // }

  @ApiOperation({ summary: '알림 자세히 조회' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<AlertResponseDto> {
    return this.alertService.findOne(+id);
  }
}
