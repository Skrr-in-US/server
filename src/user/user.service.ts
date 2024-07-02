const dotenv = require('dotenv');
dotenv.config();
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserInfoResponseDto } from 'src/auth/dto/response/userInfo-response-dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      +process.env.SALTHASH
    );
    return await this.userRepository.save(createUserDto);
  }

  async findUser(userInfo: UserInfoResponseDto) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.name', 'user.gender'])
      .where('user.id != :id', { id: userInfo.id })
      .andWhere('user.school = :school', { school: userInfo.school })
      .orderBy('RAND()')
      .limit(4)
      .getMany();
  }

  findOne(id: number) {}

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
