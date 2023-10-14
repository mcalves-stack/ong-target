import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDto, CreateUser } from './dto';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // increver-se
  @UseGuards(JwtGuard)
  @Post('signup')
  signup(@Body() dto: CreateUser) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
