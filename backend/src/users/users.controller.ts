import { Controller, Patch, Param, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUsersDto } from './dto/update-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findUser(@Param('id') id: number) {
    try {
        const user  = await this.usersService.findOne(id)
        user.password = undefined;

    } catch (error) {
        throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
    
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUsersDto) {
    console.log(id)
    try {
      const updatedUser = await this.usersService.update(id, updateUserDto);
      updatedUser.password = undefined;
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}