import { PartialType } from '@nestjs/mapped-types';
import { CreateProviderManualDto } from './create-provider-manual.dto';

// DTO para la actualización de proveedores.
// Extiende de CreateProviderDto permitiendo campos opcionales.
export class UpdateProviderDto extends PartialType(CreateProviderManualDto) {}
