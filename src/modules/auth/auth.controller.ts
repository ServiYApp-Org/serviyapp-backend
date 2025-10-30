import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // === REGISTRO / LOGIN CON EMAIL ===
  @Post('register/user')
  registerUser(@Body() body: any) {
    return this.authService.registerUser(body);
  }

  @Post('register/provider')
  registerProvider(@Body() body: any) {
    return this.authService.registerProvider(body);
  }

  @Post('login/user')
  loginUser(@Body() body: { email: string; password: string }) {
    return this.authService.loginUser(body.email, body.password);
  }

  @Post('login/provider')
  loginProvider(@Body() body: { email: string; password: string }) {
    return this.authService.loginProvider(body.email, body.password);
  }

  // === GOOGLE USER LOGIN ===
  @Get('google/user')
  @UseGuards(AuthGuard('google-user'))
  async googleUserLogin() {}

  @Get('google/user/callback')
  @UseGuards(AuthGuard('google-user'))
  async googleUserCallback(@Req() req) {
    return this.authService.loginGoogleUser(req.user);
  }

  // === GOOGLE PROVIDER LOGIN ===
  @Get('google/provider')
  @UseGuards(AuthGuard('google-provider'))
  async googleProviderLogin() {}

  @Get('google/provider/callback')
  @UseGuards(AuthGuard('google-provider'))
  async googleProviderCallback(@Req() req) {
    return this.authService.loginGoogleProvider(req.user);
  }
}
