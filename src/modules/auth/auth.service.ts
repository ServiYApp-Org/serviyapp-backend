import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';
import { ProvidersService } from 'src/modules/providers/providers.service';
import { Role } from './roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly providersService: ProvidersService,
    private readonly jwtService: JwtService,
  ) {}

  // REGISTRO DE USUARIO

  async registerUser(data: any) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.create({
      ...data,
      email,
      password: hashedPassword,
      role: data.role || Role.User,
    });

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario registrado correctamente',
      access_token: token,
      user: {
        id: newUser.id,
        names: newUser.names,
        surnames: newUser.surnames,
        email: newUser.email,
        role: newUser.role,
      },
    };
  }


  //  REGISTRO DE PROVEEDOR

  async registerProvider(data: any) {
    const email = data.email.trim().toLowerCase();
    const existing = await this.providersService.findByEmail(email);
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newProvider = await this.providersService.create({
      names: data.firstName,
      surnames: data.lastName,
      userName: data.username,
      email,
      phone: data.phone,
      password: hashedPassword,
      country: data.country || 'Colombia',
      region: data.region,
      city: data.city,
      address: data.address || data.Address || data.Adreess,
      role: Role.Provider,
      status: 'pending',
      registrationDate: new Date(),
    });

    const payload = { id: newProvider.id, email: newProvider.email, role: newProvider.role };
    const token = this.jwtService.sign(payload);

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
      },
    };
  }


  // LOGIN USUARIO

  async loginUser(email: string, password: string) {
    email = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        names: user.names,
        surnames: user.surnames,
        email: user.email,
        role: user.role,
      },
    };
  }


  // LOGIN PROVEEDOR

  async loginProvider(email: string, password: string) {
    email = email.trim().toLowerCase();
    const provider = await this.providersService.findByEmail(email);
    if (!provider) throw new UnauthorizedException('Proveedor no encontrado');

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { id: provider.id, email: provider.email, role: Role.Provider };
    return {
      access_token: this.jwtService.sign(payload),
      provider: {
        id: provider.id,
        names: provider.names,
        surnames: provider.surnames,
        email: provider.email,
        role: provider.role,
      },
    };
  }


  // GOOGLE LOGIN / REGISTRO DE USUARIO

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
      });
    }

    return user;
  }

  async loginGoogleUser(user) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        names: user.names,
        surnames: user.surnames,
        email: user.email,
        role: user.role,
      },
    };
  }

  // GOOGLE LOGIN / REGISTRO DE PROVEEDOR

  async validateOrCreateGoogleProvider(providerData) {
    let provider = await this.providersService.findByEmail(providerData.email);

    if (!provider) {
      const autoUserName =
        providerData.names?.toLowerCase().replace(/\s+/g, '') +
        Math.floor(Math.random() * 10000); // genera un username temporal

      provider = await this.providersService.create({
        names: providerData.names || 'Proveedor',
        surnames: providerData.surnames || '',
        userName: autoUserName,
        email: providerData.email,
        phone: null, // o '0000000000' si sigues usando NOT NULL
        password: '',
        role: Role.Provider,
        status: 'pending',
        country: undefined,
        region: undefined,
        city: undefined,
      });
    }

    return provider;
  }

  async loginGoogleProvider(provider) {
    const payload = { id: provider.id, email: provider.email, role: provider.role };
    return {
      access_token: this.jwtService.sign(payload),
      provider: {
        id: provider.id,
        names: provider.names,
        surnames: provider.surnames,
        email: provider.email,
        role: provider.role,
        status: provider.status,
      },
    };
  }
}
