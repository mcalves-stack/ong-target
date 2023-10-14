import { Controller, Get, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorator/main';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    ) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  getAll(user: User) {
    const getAll = this.usersService.findAll();
      
    return getAll;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const findOne = this.usersService.findOne(+id);

    return findOne;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const update = this.usersService.update(+id, dto)

    return update;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const remove = this.usersService.remove(+id);

    return remove;
  }
}
