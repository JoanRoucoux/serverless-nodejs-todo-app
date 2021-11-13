import validate from 'validate.js/validate';

// Models
import ResponseModel from '../models/response.model';

// Interfaces
import { IGeneric } from '../interfaces/generic.interface';

/**
 * Validate values against constraints
 * @param values
 * @param constraints
 * @return {Promise<*>}
 */
export const validateAgainstConstraints = (
  values: IGeneric<string>,
  constraints: IGeneric<Record<string, unknown>>
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const validation = validate(values, constraints);

    if (typeof validation === 'undefined') {
      resolve();
    } else {
      reject(
        new ResponseModel({ validation }, 400, 'required fields are missing')
      );
    }
  });
};
