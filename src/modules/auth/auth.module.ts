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

// Módulo de autenticación.
// Centraliza la configuración de JWT, las estrategias de autenticación
// y los controladores relacionados con el login y registro.
@Module({
  imports: [
    // Módulo Passport para habilitar el uso de estrategias de autenticación.
    PassportModule,

    // Módulo JWT para la creación y validación de tokens.
    // Usa la clave secreta definida en las variables de entorno.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' }, // Duración del token: 7 días.
    }),

    // Módulos de usuarios y proveedores, necesarios para las operaciones de autenticación.
    UsersModule,
    ProvidersModule,
  ],

  // Controladores asociados al módulo de autenticación.
  controllers: [AuthController], 

  // Servicios y estrategias utilizadas en la autenticación.
  providers: [
    AuthService,              // Servicio principal de autenticación.
    JwtStrategy,              // Estrategia para validar tokens JWT.
    GoogleProviderStrategy,   // Estrategia Google para proveedores.
    GoogleUserStrategy,       // Estrategia Google para usuarios.
  ],

  // Exporta el servicio para que pueda ser utilizado en otros módulos.
  exports: [AuthService],
})
export class AuthModule {}
