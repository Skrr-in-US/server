import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('school')
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 만들기(어드민용)' })
  @Post()
  create(@Req() request: any, @Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(request.user, createSchoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 다 가져오기(어드민용)' })
  @Get()
  findAll(@Req() request: any) {
    return this.schoolService.findAll(request.user);
  }

  @ApiOperation({ summary: '학교 검색하기' })
  @ApiQuery({
    name: 'school',
    required: true,
    description: '학교 이름(유사해도 됨. 예: 부산소마고 => 소마고, 부산)',
  })
  @Get('/search')
  findSchool(@Query() school: any) {
    return this.schoolService.findSchool(school.school);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 삭제(어드민용)' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '학교 아이디',
  })
  @Delete(':id')
  remove(@Req() request: any, @Param('id') id: string) {
    return this.schoolService.remove(request.user, +id);
  }
}
