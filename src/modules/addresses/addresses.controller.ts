import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

// Controlador del módulo "addresses".
// Gestiona la creación, consulta, actualización y eliminación de direcciones.
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  // Crea una nueva dirección.
  @Post()
  async create(@Body() dto: CreateAddressDto) {
    return this.addressesService.create(dto);
  }

  // Obtiene todas las direcciones registradas.
  @Get()
  async findAll() {
    return this.addressesService.findAll();
  }

  // Obtiene una dirección por su ID.
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  // Actualiza parcialmente una dirección existente.
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressesService.update(id, dto);
  }

  // Elimina una dirección del sistema.
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
