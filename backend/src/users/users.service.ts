import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAccountRequestDto } from '../auth/dto/register-account-request.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import { UpdateUsersDto } from './dto/update-users.dto';
import { UsersBuilder } from './builders/users.builder';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUsername(username: string): Promise<Users | undefined> {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async create(registerDto: RegisterAccountRequestDto): Promise<boolean> {
    // create a new user on mariaDB
    try {
      const existingUser = await this.findUsername(registerDto.username);
      if (existingUser) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      let user = new UsersBuilder()
        .setUsername(registerDto.username)
        .setPassword(registerDto.password)
        .setFirstName(registerDto.firstName)
        .setLastName(registerDto.lastName)
        .build();

      await this.usersRepository.save(user);
      return true;
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUsersDto): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOne({ where: { id: id } });
  }
}
