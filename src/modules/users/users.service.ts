import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

// Servicio encargado de la lógica de negocio de los usuarios.
// Gestiona operaciones CRUD y consultas específicas.
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Buscar usuario por correo electrónico.
  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    return this.userRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  // Crear un nuevo usuario (utilizado por AuthService).
  async create(data: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }

  // Obtener todos los usuarios registrados.
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { registrationDate: 'DESC' },
    });
  }

  // Obtener un usuario por su ID.
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  // Actualizar la información de un usuario.
  // Permite modificar campos internos como isCompleted.
  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return await this.userRepository.save(user);
  }

  // Eliminar un usuario existente.
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
