import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard que protege rutas usando la estrategia JWT definida en Passport.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
