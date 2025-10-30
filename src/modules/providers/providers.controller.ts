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

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  // Solo admin puede listar todos los proveedores
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.providersService.findAll();
  }

  // Admin o el propio provider pueden ver su info
  @Get(':id')
  @Roles(Role.Admin, Role.Provider)
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para ver este perfil');
    return this.providersService.findOne(id);
  }

  // Admin o el propio provider pueden actualizar su perfil
  @Patch(':id')
  @Roles(Role.Admin, Role.Provider)
  async update(@Param('id') id: string, @Body() dto: UpdateProviderDto, @Req() req) {
    const user = req.user;
    if (user.role !== Role.Admin && user.id !== id)
      throw new ForbiddenException('No tienes permiso para modificar este perfil');
    return this.providersService.update(id, dto);
  }

  // Solo admin puede eliminar proveedores
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
