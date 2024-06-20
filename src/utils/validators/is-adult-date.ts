import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAdultDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAdultDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) {
            return false;
          }

          const currentDate = new Date();
          const eighteenYearsAgo = new Date();
          eighteenYearsAgo.setFullYear(currentDate.getFullYear() - 18);

          return value.getFullYear() <= eighteenYearsAgo.getFullYear();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} should be more than 17 years old`;
        },
      },
    });
  };
}
