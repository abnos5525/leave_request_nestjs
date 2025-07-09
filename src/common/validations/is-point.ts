import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const geoJsonValidation = require('geojson-validation');

@ValidatorConstraint({ name: 'IsPoint' })
export class IsPoint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    return geoJsonValidation.isPoint(value);
  }
}
