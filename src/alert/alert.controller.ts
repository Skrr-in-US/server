import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@ApiTags('알림')
@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @ApiOperation({ summary: '알림 생성' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createAlertDto: CreateAlertDto,
    @Headers('Authorization') token: string
  ): Promise<CreateAlertDto> {
    return this.alertService.create(createAlertDto, token);
  }

  @ApiOperation({ summary: '전체 알림 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findByUser(@Headers('Authorization') token: string) {
    return this.alertService.findByUser(token);
  }

  @ApiOperation({ summary: '알림 자세히 조회' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Headers('Authorization') token: string) {
    return this.alertService.findOne(+id, token);
  }
}
