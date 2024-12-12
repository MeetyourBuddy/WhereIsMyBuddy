import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'interests', async: false })
@Injectable()
export class InterestsValidator implements ValidatorConstraintInterface {
  validate(interests: string[], args: ValidationArguments) {
    if (!Array.isArray(interests)) return false;
    if (interests.length === 0) return false;
    if (interests.length > 5) return false; // Maximum 5 interests
    
    return interests.every(interest => 
      typeof interest === 'string' && 
      interest.length >= 2 && 
      interest.length <= 20
    );
  }

  defaultMessage(args: ValidationArguments) {
    return 'Interests must be an array of 1-5 strings, each 2-20 characters long';
  }
}