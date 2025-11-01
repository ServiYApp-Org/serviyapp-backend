import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { IsUnique } from 'src/modules/common/validators/is-unique.validator';
import { Provider } from '../entities/provider.entity';
import { Role } from 'src/modules/auth/roles.enum';
import { ProviderStatus } from '../enums/provider-status.enum';

/**
 * DTO para la creación de un nuevo proveedor.
 * Valida los datos antes de registrarlos en la base de datos.
 */
export class CreateProviderDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio para el registro' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/, {
    message: 'El nombre solo puede contener letras, espacios, acentos, guiones o apóstrofes',
  })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres' })
  names: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio para el registro' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/, {
    message: 'El apellido solo puede contener letras, espacios, acentos, guiones o apóstrofes',
  })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede superar los 50 caracteres' })
  surnames: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @Matches(/^[a-zA-Z0-9._-]{3,20}$/, {
    message:
      'El nombre de usuario solo puede contener letras, números, guiones, guiones bajos y puntos (3-20 caracteres)',
  })
  userName: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio para el registro' })
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsUnique(Provider, 'email', { message: 'El correo ya está registrado' })
  email: string;

  @IsOptional() // 👉 Esto permite registro por Google (sin contraseña)
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(15, { message: 'La contraseña no puede tener más de 15 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*).',
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(8, { message: 'El número de teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El número de teléfono no puede tener más de 20 dígitos' })
  phone?: string;

  @IsUUID('4', { message: 'El país debe ser un UUID válido' })
  @IsOptional()
  countryId?: string;

  @IsUUID('4', { message: 'La región debe ser un UUID válido' })
  @IsOptional()
  regionId?: string;

  @IsUUID('4', { message: 'La ciudad debe ser un UUID válido' })
  @IsOptional()
  cityId?: string;

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La dirección no puede tener más de 100 caracteres' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'La URL de la foto de perfil debe ser una cadena de texto' })
  profilePicture?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser un valor válido' })
  role?: Role;

  @IsOptional()
  @IsEnum(ProviderStatus, {
    message: 'El estado debe ser válido (active, inactive, deleted, pending)',
  })
  status?: ProviderStatus;


  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  registrationDate?: Date;
}
