import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {
    const findAll = await this.prisma.user.findMany();

    return findAll;
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const updateuser = await this.prisma.user.update({
      where: {
        id
      },
      data: dto
    });

    return updateuser;
  }

  async remove(id: number) {
    const deleteUser = await this.prisma.user.delete({
      where: {
        id
      }
    });
    return deleteUser;
  }
}
