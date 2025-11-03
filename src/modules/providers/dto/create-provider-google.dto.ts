import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateProviderGoogleDto {
  @IsString()
  @IsOptional()
  names?: string;

  @IsString()
  @IsOptional()
  surnames?: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  password?: null;
}
