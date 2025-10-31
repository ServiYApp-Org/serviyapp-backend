import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

// Controlador encargado de la gestión de usuarios.
// Permite listar, consultar, actualizar y eliminar perfiles.
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Listar todos los usuarios (solo administrador).
  @ApiBearerAuth()
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.usersService.findAll();
  }

  // Obtener un usuario por ID (solo administrador).
  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Actualizar perfil general del usuario.
  // Solo el propio usuario o un administrador pueden modificarlo.
  @ApiBearerAuth()
  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para modificar este perfil');

    // Filtramos manualmente campos sensibles.
    const { email, role, isCompleted, ...safeData } = dto as any;

    const updatedUser = await this.usersService.update(id, safeData);
    return {
      message: 'Usuario actualizado correctamente',
      user: updatedUser,
    };
  }

  // Completar registro tras autenticación con Google.
  // Permite completar datos faltantes y marcar el perfil como completo.
  @ApiBearerAuth()
  @Patch('complete/:id')
  @Roles(Role.User, Role.Admin)
  async completeProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req,
  ) {
    const currentUser = req.user;
    if (currentUser.role !== Role.Admin && currentUser.id !== id)
      throw new ForbiddenException('No tienes permiso para completar este perfil');

    const { email, role, isCompleted, ...safeData } = dto as any;

    const updatedUser = await this.usersService.update(id, {
      ...safeData,
      isCompleted: true,
    });

    return {
      message: 'Perfil completado correctamente',
      user: updatedUser,
    };
  }

  // Eliminar un usuario (solo administrador).
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
