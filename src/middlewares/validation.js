import { validateSchema } from '../utils/validateSchema.js';

export const validateBody = (schema, errorMessage = "Datos de solicitud inválidos") => {
  return (req, res, next) => {
    try {
      req.body = validateSchema(schema, req.body, errorMessage);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = (schema, errorMessage = "Parámetros de URL inválidos") => {
  return (req, res, next) => {
    try {
      req.params = validateSchema(schema, req.params, errorMessage);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema, errorMessage = "Parámetros de consulta inválidos") => {
  return (req, res, next) => {
    try {
      req.query = validateSchema(schema, req.query, errorMessage);
      next();
    } catch (error) {
      next(error);
    }
  };
};
