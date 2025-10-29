import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Registro de usuario
  @Post('register/user')
  async registerUser(@Body() body: any) {
    return this.authService.registerUser(body);
  }

  // Registro de proveedor
  @Post('register/provider')
  async registerProvider(@Body() body: any) {
    return this.authService.registerProvider(body);
  }

  // Login de usuario
  @Post('login/user')
  async loginUser(@Body() body: { email: string; password: string }) {
    return this.authService.loginUser(body.email, body.password);
  }

  // Login de proveedor
  @Post('login/provider')
  async loginProvider(@Body() body: { email: string; password: string }) {
    return this.authService.loginProvider(body.email, body.password);
  }
}
