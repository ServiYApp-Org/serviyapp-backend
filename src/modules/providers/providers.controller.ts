import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { CreateProviderDto } from './dto/create-provider.dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.loginProvider(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: CreateProviderDto) {
    return this.authService.registerProvider(body);
  }
}
