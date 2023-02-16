import { TokenValidation } from '@shared/validation/token.validation';
import * as Yup from 'yup';

export const tokenYupSchema = {
  pin: Yup.string().max(TokenValidation.PIN_LENGTH, 'Pin has incorrect length'),
};
