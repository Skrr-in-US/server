import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { School } from './entities/school.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>
  ) {}

  async create(user: User, createSchoolDto: CreateSchoolDto) {
    if (user[0].role !== 'admin') throw new UnauthorizedException();
    return await this.schoolRepository.save(createSchoolDto);
  }

  async findSchool(school: string) {
    return await this.schoolRepository.find({
      where: {
        school: Like(`%${school}%`),
      },
    });
  }
  async findAll(user: User) {
    if (user[0].role !== 'admin') throw new UnauthorizedException();

    return await this.schoolRepository.find();
  }

  async remove(user: User, id: number) {
    if (user[0].role !== 'admin') throw new UnauthorizedException();

    return await this.schoolRepository.delete(id);
  }
}
