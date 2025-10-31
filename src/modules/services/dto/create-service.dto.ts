import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';

// DTO para la creación de un nuevo servicio.
// Valida los campos obligatorios y opcionales antes de registrar el servicio.
export class CreateServiceDto {
  @ApiProperty({ example: 'Nombre Servicio' })
  @IsString({ message: 'El nombre del servicio debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del servicio es obligatorio' })
  name: string;

  @ApiProperty({ example: 'Descripcion del servicio' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/photos/example.jpg' })
  @IsString({ message: 'La URL de la foto debe ser una cadena de texto' })
  @IsOptional()
  photo?: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'El estado debe ser un valor booleano (true o false)' })
  @IsOptional()
  status?: boolean;

  @ApiProperty({ example: 60})
  @IsInt({ message: 'La duración debe ser un número entero en minutos' })
  @IsOptional()
  @Min(1, { message: 'La duración mínima debe ser de 1 minuto' })
  duration?: number;

  @IsUUID('4', { message: 'El ID del proveedor debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El proveedor es obligatorio' })
  providerId: string;

  @IsUUID('4', { message: 'El ID de la categoría debe ser un UUID válido' })
  @IsOptional()
  categoryId?: string;
}
