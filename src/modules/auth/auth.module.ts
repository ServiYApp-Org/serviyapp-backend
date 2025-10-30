import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller'; 
import { UsersModule } from '../users/users.module';
import { ProvidersModule } from '../providers/providers.module';
import { GoogleProviderStrategy } from './strategies/google-provider.strategy';
import { GoogleUserStrategy } from './strategies/google-user.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    UsersModule,
    ProvidersModule,
  ],
  controllers: [AuthController], 
  providers: [AuthService, JwtStrategy, GoogleProviderStrategy, GoogleUserStrategy ],
  exports: [AuthService],
})
export class AuthModule {}
