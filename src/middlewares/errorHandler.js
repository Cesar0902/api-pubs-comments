import { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError, 
  ConflictError 
} from '../errors/customErrors.js';

export const errorHandler = (err, req, res, next) => {
  // Errores personalizados
  if (err instanceof BadRequestError) {
    return res.status(err.statusCode).json({
      error: err.message,
      issues: err.details
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  if (err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado'
    });
  }

  // Errores de base de datos
  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Ya existe un registro con estos datos'
    });
  }

  // Error interno del servidor
  console.error('Error interno del servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor' 
  });
};
