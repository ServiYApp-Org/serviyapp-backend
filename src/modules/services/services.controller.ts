import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

// Controlador encargado de la gestión de servicios.
// Permite crear, listar, consultar, actualizar y eliminar servicios.
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // Crear un nuevo servicio.
  @Post('create')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  // Obtener todos los servicios registrados.
  @Get('find-all')
  findAll() {
    return this.servicesService.findAll();
  }

  // Obtener un servicio por su ID.
  @Get('find/:id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  // Actualizar un servicio existente.
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  // Eliminar un servicio por su ID.
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
