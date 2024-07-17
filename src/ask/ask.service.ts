import { Injectable } from '@nestjs/common';
import { CreateAskDto } from './dto/create-ask.dto';
import { UpdateAskDto } from './dto/update-ask.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Ask } from './entities/ask.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AskService {
  constructor(
    @InjectRepository(Ask)
    private readonly askRepository: Repository<Ask>
  ) {}

  async create(user: User, createAskDto: CreateAskDto) {
    createAskDto.userId = user[0].id;
    return await this.askRepository.save(createAskDto);
  }

  findAll() {
    return `This action returns all ask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ask`;
  }

  update(id: number, updateAskDto: UpdateAskDto) {
    return `This action updates a #${id} ask`;
  }

  remove(id: number) {
    return `This action removes a #${id} ask`;
  }
}
