
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterAccountRequestDto } from 'src/auth/dto/register-account-request.dto';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';


// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  
  async findUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { username: username } });
  }

  async create(registerDto: RegisterAccountRequestDto): Promise<boolean> {
    // create a new user on mariaDB
  try{
    const existingUser = await this.findUsername(registerDto.username);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user = this.usersRepository.create({
      username: registerDto.username,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      password: registerDto.password,
    });
    await this.usersRepository.save(user);
    return true;
    
  }
  catch(e){
    console.log(e);
    if(e instanceof HttpException){
      throw e;
    }
    throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  }
}
