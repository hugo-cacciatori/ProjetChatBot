import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
  Patch,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAccountRequestDto } from 'src/auth/dto/register-account-request.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUsersDto } from './dto/update-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findUsername(username: string): Promise<User | undefined> {
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

      const user = this.usersRepository.create(registerDto);
      console.log("user")
      console.log(user)
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

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUsersDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOne({ where: { id: id } });
  }
}
