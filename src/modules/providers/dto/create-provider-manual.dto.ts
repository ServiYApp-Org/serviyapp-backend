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

export class CreateProviderManualDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio para el registro' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/, {
    message:
      'El nombre solo puede contener letras, espacios, acentos, guiones o apóstrofes',
  })
  @MinLength(2)
  @MaxLength(50)
  names: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/, {
    message:
      'El apellido solo puede contener letras, espacios, acentos, guiones o apóstrofes',
  })
  @MinLength(2)
  @MaxLength(50)
  surnames: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9._-]{3,20}$/, {
    message:
      'El nombre de usuario solo puede contener letras, números, guiones, guiones bajos y puntos (3-20 caracteres)',
  })
  userName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(Provider, 'email', { message: 'El correo ya está registrado' })
  email: string;

  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*).',
  })
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone: string;

  @IsUUID('4', { message: 'El país debe ser un UUID válido' })
  countryId: string;

  @IsUUID('4', { message: 'La región debe ser un UUID válido' })
  regionId: string;

  @IsUUID('4', { message: 'La ciudad debe ser un UUID válido' })
  cityId: string;

  @IsString()
  @MaxLength(100)
  address: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(ProviderStatus)
  status?: ProviderStatus;

  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  registrationDate?: Date;
}
