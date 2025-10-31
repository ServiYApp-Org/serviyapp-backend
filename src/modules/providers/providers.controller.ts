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
import { ProvidersService } from './providers.service';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/modules/auth/roles.enum';

// Controlador encargado de la gestión de proveedores.
// Permite listar, consultar, actualizar y eliminar registros.
@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  // Listar todos los proveedores (solo administrador).
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.providersService.findAll();
  }

  // Obtener un proveedor por ID (acceso restringido a su propio perfil o administrador).
  @Get(':id')
  @Roles(Role.Admin, Role.Provider)
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para ver este perfil');

    return this.providersService.findOne(id);
  }

  // Actualizar perfil general del proveedor.
  // Solo el propio proveedor o el administrador pueden modificarlo.
  @Patch(':id')
  @Roles(Role.Admin, Role.Provider)
  async update(@Param('id') id: string, @Body() dto: UpdateProviderDto, @Req() req) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para modificar este perfil');

    // Filtra campos sensibles e internos.
    const { email, role, isCompleted, ...safeData } = dto as any;

    const updatedProvider = await this.providersService.update(id, safeData);
    return {
      message: 'Proveedor actualizado correctamente',
      provider: updatedProvider,
    };
  }

  // Completar registro tras autenticación con Google.
  // Permite agregar los datos faltantes y marcar el perfil como completo.
  @Patch('complete/:id')
  @Roles(Role.Provider, Role.Admin)
  async completeProviderProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProviderDto,
    @Req() req,
  ) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para completar este perfil');

    const { email, role, isCompleted, ...safeData } = dto as any;

    const updatedProvider = await this.providersService.update(id, {
      ...safeData,
      isCompleted: true,
    });

    return {
      message: 'Perfil de proveedor completado correctamente',
      provider: updatedProvider,
    };
  }

  // Eliminar un proveedor (solo administrador).
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
