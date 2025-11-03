import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { ProvidersService } from 'src/modules/providers/providers.service';
import { Role } from './roles.enum';
import { ProviderStatus } from '../providers/enums/provider-status.enum';
import { getGoogleRedirectUrl } from 'src/helpers/redirect.helper';
import { CreateProviderManualDto } from '../providers/dto/create-provider-manual.dto';
import { CreateProviderGoogleDto } from '../providers/dto/create-provider-google.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly providersService: ProvidersService,
    private readonly jwtService: JwtService,
  ) {}

  // Registro de usuario
  async registerUser(data: any) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const newUser = await this.usersService.create({
      ...data,
      email,
      role: data.role || Role.User,
      country_id: data.country,
    });

    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    return {
      message: 'Usuario registrado correctamente',
      access_token: token,
      user: {
        id: newUser.id,
        names: newUser.names,
        surnames: newUser.surnames,
        email: newUser.email,
        role: newUser.role,
        isCompleted: true,
      },
    };
  }

  // Registro de proveedor (con validación de país, región, ciudad)
  async registerProvider(data: CreateProviderManualDto) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.providersService.findByEmail(email);
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const newProvider = await this.providersService.create({
      names: data.names,
      surnames: data.surnames,
      userName: data.userName,
      email,
      phone: data.phone,
      password: data.password,
      countryId: data.countryId,
      regionId: data.regionId,
      cityId: data.cityId,
      address: data.address || data.address || data.address,
      role: Role.Provider,
    });

    const payload = {
      id: newProvider.id,
      email: newProvider.email,
      role: newProvider.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    return {
      message: 'Proveedor registrado correctamente',
      access_token: token,
      provider: {
        id: newProvider.id,
        names: newProvider.names,
        surnames: newProvider.surnames,
        userName: newProvider.userName,
        email: newProvider.email,
        phone: newProvider.phone,
        country: newProvider.country,
        region: newProvider.region,
        city: newProvider.city,
        address: newProvider.address,
        role: newProvider.role,
        status: newProvider.status,
        isCompleted: newProvider.isCompleted,
      },
    };
  }

  // Login de usuario
  async loginUser(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      message: 'Usuario autenticado correctamente',
      access_token: this.jwtService.sign(payload, { expiresIn: '30m' }),
      user,
    };
  }

  // Login de proveedor
  async loginProvider(email: string, password: string) {
    email = email.trim().toLowerCase();
    const provider = await this.providersService.findByEmail(email);
    if (!provider) throw new UnauthorizedException('Proveedor no encontrado');

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = {
      id: provider.id,
      email: provider.email,
      role: provider.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    return {
      message: 'Proveedor autenticado correctamente',
      access_token: token,
      provider,
    };
  }

  // Google User
  async validateOrCreateGoogleUser(userData) {
    const email = userData.email.trim().toLowerCase();
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      const [firstName, ...rest] = (userData.names || '').split(' ');
      const lastName = rest.join(' ') || userData.surnames || 'No definido';

      user = await this.usersService.create({
        names: firstName || email.split('@')[0],
        surnames: lastName,
        email,
        password: '',
        role: Role.User,
        profilePicture: userData.profilePicture,
        isCompleted: false,
      });
    }

    return user;
  }

  async loginGoogleUser(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      isCompleted: user.isCompleted,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });
    return {
      message: 'Usuario autenticado correctamente',
      access_token: token,
      user,
    };
  }

  // Google Provider
  async validateOrCreateGoogleProvider(providerData: CreateProviderGoogleDto) {
    const email = providerData.email.trim().toLowerCase();
    let provider = await this.providersService.findByEmail(email);
    if (provider) return provider;

    const baseName = (providerData.names || email.split('@')[0])
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();

    let userName = baseName;

    const existingUsername =
      await this.providersService.findByUsername(userName);
    if (existingUsername) {
      const suffix = Math.floor(Math.random() * 10000);
      userName = `${baseName}${suffix}`;
    }

    provider = await this.providersService.create({
      names: providerData.names || 'Proveedor',
      surnames: providerData.surnames || '',
      userName,
      email,
      phone: '',
      password: '',
      role: Role.Provider,
    });

    return provider;
  }

  async loginGoogleProvider(provider) {
    const payload = {
      id: provider.id,
      email: provider.email,
      role: provider.role,
      isCompleted: provider.isCompleted,
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30m' }),
      provider,
    };
  }

  async handleGoogleUserRedirect(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    const redirectUrl = `${process.env.FRONTEND_BASE_URL}/google-callback-user?token=${token}`;

    return { redirectUrl };
  }

  // // Maneja el redireccionamiento cuando un usuario inicia sesión con Google.
  // async handleGoogleUserRedirect(user: any) {
  //   const payload = { id: user.id, email: user.email, role: user.role };
  //   // Genera token JWT válido por 30 minutos
  //   const token = this.jwtService.sign(payload, { expiresIn: '30m' });
  //   // Usa helper centralizado
  //   const redirectUrl = getGoogleRedirectUrl(user.isCompleted, user.role, token);

  //   return { redirectUrl };
  // }

  async handleGoogleProviderRedirect(provider: any) {
    console.log(
      '🔹 handleGoogleProviderRedirect: proveedor recibido =>',
      provider,
    );

    if (!provider || !provider.id) {
      console.error('❌ Proveedor sin ID al manejar redirección Google');
      return {
        redirectUrl:
          process.env.FRONTEND_BASE_URL +
          '/loginProvider?error=google_provider_not_found',
      };
    }

    const payload = {
      id: provider.id,
      email: provider.email,
      role: provider.role || Role.Provider,
      isCompleted: provider.isCompleted,
    };

    const token = this.jwtService.sign(payload, { expiresIn: '30m' });

    // Si aún no ha completado su perfil
    if (!provider.isCompleted) {
      const redirectUrl = `${process.env.FRONTEND_BASE_URL}/google-callback-provider?id=${provider.id}&token=${token}`;
      console.log(' Redirigiendo al callback provider:', redirectUrl);
      return { redirectUrl };
    }

    // Si ya lo completó, lo mandas directo al dashboard
    const redirectUrl = `${process.env.FRONTEND_BASE_URL}/provider/dashboard?token=${token}`;
    console.log(' Redirigiendo al dashboard provider:', redirectUrl);

    return { redirectUrl };
  }

  // // Maneja el redireccionamiento cuando un proveedor inicia sesión con Google.
  // async handleGoogleProviderRedirect(provider: any) {
  //   const payload = { id: provider.id, email: provider.email, role: provider.role };

  //   // Genera token JWT válido por 30 minutos
  //   const token = this.jwtService.sign(payload, { expiresIn: '30m' });

  //   // Usa helper centralizado
  //   const redirectUrl = getGoogleRedirectUrl(provider.isCompleted, provider.role, token);

  //   return { redirectUrl };
  // }
  // Obtener perfil según rol (para /auth/me)
  // auth.service.ts
async getProfile(id: string, role: Role | string) {
  // 🔹 Normalizamos el rol (por si viene "provider" o "Provider")
  const normalizedRole = String(role).toLowerCase();

  if (normalizedRole === 'provider') {
    const provider = await this.providersService.findOne(id);
    if (!provider) throw new BadRequestException('Proveedor no encontrado');
    return provider;
  }

  if (normalizedRole === 'user') {
    const user = await this.usersService.findOne(id);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    return user;
  }

  if (normalizedRole === 'admin') {
    return { message: 'Perfil de administrador autenticado correctamente' };
  }

  throw new BadRequestException(`Rol no válido: ${role}`);
}

}
