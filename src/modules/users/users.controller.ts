import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.loginUser(body.email, body.password);
  }
}
