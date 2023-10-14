import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto, CreateUser } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService
    ) {}

  async signup(dto: CreateUser) {
    // generate the o password hash
    const hash = await argon.hash(dto.password)
    // save the o new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          hash
        },
      }); 

      return this.signToken(user.id, user.email)
    } catch (error) {
      // prisma error P2002
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Email já cadastrado'
          );
        }
        throw error
      }
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email
      }
    })
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException(
        'Email ou senha incorretos'
      );
    }
    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password)
    // if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException(
        'Email ou senha incorretos'
      );
    }

    return this.signToken(user.id, user.email)
  }

  async signToken(userId: number, email: string): Promise<{access_token: string}> {
    const payload = { 
      userId, 
      email 
    };
    const secret = await this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, 
    {
      expiresIn: '15m',
      secret: secret
    }
  );

    return {
      access_token: token,
    }
  }
}
