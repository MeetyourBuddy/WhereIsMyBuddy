import { registerDecorator, ValidationOptions } from 'class-validator';

export function ValidateInterests(validationOptions?: ValidationOptions) {
  return function (_: object, __: string) {
    registerDecorator({
      name: 'validateInterests',
      target: Object,
      propertyName: __,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!Array.isArray(value)) return false;
          if (value.length === 0) return false;
          return value.every(
            (interest) =>
              typeof interest === 'string' && interest.trim().length > 0,
          );
        },
        defaultMessage() {
          return 'Interests must be a non-empty array of strings';
        },
      },
    });
  };
}

export function ValidateLocation(validationOptions?: ValidationOptions) {
  return function (_: object, __: string) {
    registerDecorator({
      name: 'validateLocation',
      target: Object,
      propertyName: __,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage() {
          return 'Location must be a non-empty string';
        },
      },
    });
  };
}
