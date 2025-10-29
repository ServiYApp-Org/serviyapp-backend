import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async validate(value: any, args: any) {
    const [entityClass, property] = args.constraints;

    const repo = this.dataSource.getRepository(entityClass);

    const existing = await repo.findOne({
      where: { [property]: value },
    });

    return !existing; // true si NO existe (válido)
  }

  defaultMessage(args: any) {
    const [_, property] = args.constraints;
    return `El valor del campo "${property}" ya está registrado`;
  }
}

export function IsUnique(
  entityClass: Function,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entityClass, property],
      validator: IsUniqueConstraint,
    });
  };
}
