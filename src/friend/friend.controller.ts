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
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';

@ApiTags('친구(만들지마셈XXXX)')
@Controller('friend')
export class FriendController {
  constructor(
    private readonly friendService: FriendService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({ summary: '친구 추가 / 수락' })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() request: any, @Body() createFriendDto: CreateFriendDto) {
    return this.friendService.create(createFriendDto, request.user);
  }

  @ApiOperation({ summary: '같은 학교 학생(친구될 수 있는 사람들)' })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() request: any) {
    return this.userService.findBySchool(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }
}
