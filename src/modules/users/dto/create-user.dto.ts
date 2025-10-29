import { IsString, Matches, Length, IsEmail, IsOptional, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { IsUnique } from 'src/modules/common/validators/is-unique.validator';
import { User } from '../entities/user.entity';


export class CreateUserDto {
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

  @IsNotEmpty({ message: 'El correo eléctronico es obligatorio para el registro' })
  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @IsUnique(User, 'email', { message: 'El correo ya está registrado' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(15, { message: 'La contraseña no puede tener más de 15 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (!@#$%^&*).',
  })
  password: string;

  @IsNotEmpty({ message: 'El número de teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(8, { message: 'El número de teléfono debe tener al menos 8 dígitos' })
  @MaxLength(20, { message: 'El número de teléfono no puede tener más de 20 dígitos' })
  phone?: string;
}
