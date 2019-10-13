import * as Joi from 'joi';
import {
  createSuccessResponse,
  createErrorResponse,
} from '../../../utils/response-utils';


const createUserSchema = Joi.object()
  .keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  })
  .required();

export const createUserValidator = ((payload, req, res) => {
  const validationResult = Joi.validate(payload, createUserSchema);
  if (validationResult.error) {
    return createErrorResponse(req, res, validationResult.error.details[0].message);
  }
});