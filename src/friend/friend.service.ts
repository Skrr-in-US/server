import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>
  ) {}
  async create(createFriendDto: CreateFriendDto, user: User) {
    console.log(createFriendDto, user[0].id);
    const isAccept = await this.friendRepository.findOne({
      where: {
        user_id: createFriendDto.friend_id,
        friend_id: user[0].id,
        accept: false,
      },
    });
    console.log(isAccept);
    if (isAccept) {
      await this.friendRepository.update(isAccept.id, { accept: true });
      return true;
    }
    createFriendDto.user_id = user[0].id;
    return await this.friendRepository.save(createFriendDto);
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
