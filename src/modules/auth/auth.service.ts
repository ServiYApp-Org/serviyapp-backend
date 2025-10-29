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

  // REGISTRO USUARIO (cliente o admin)
  async registerUser(data: any) {
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) throw new BadRequestException('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersService.create({
      ...data,
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

// REGISTRO PROVEEDOR
async registerProvider(data: any) {
  // Verificar si el correo ya está en uso
  const existing = await this.providersService.findByEmail(data.email);
  if (existing) throw new BadRequestException('El correo ya está registrado');

  // Encriptar contraseña
  const hashedPassword = await bcrypt.hash(data.password, 10);

  //  Crear nuevo proveedor con todos los campos requeridos
  const newProvider = await this.providersService.create({
    names: data.firstName,
    surnames: data.lastName,
    userName: data.username, // si tu entidad usa "userName"
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    country: data.country || 'Colombia',
    region: data.region,
    city: data.city,
    address: data.address || data.Address || data.Adreess, // por si cambia el nombre del campo
    role: Role.Provider,
    status: 'pending', // opcional, si manejas estado de verificación
    registrationDate: new Date(),
  });

  // Generar token JWT
  const payload = { id: newProvider.id, email: newProvider.email, role: newProvider.role };
  const token = this.jwtService.sign(payload);

  // Respuesta estructurada
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

  // LOGIN USUARIOS
  async loginUser(email: string, password: string) {
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

  // LOGIN PROVEEDORES
  async loginProvider(email: string, password: string) {
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
}
