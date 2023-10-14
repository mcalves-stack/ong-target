import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy, 
  'jwt'
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: {
    sub: number;
    email: string;
  }) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub
      }
    })
    delete user.hash;
    return user;
  }
}
