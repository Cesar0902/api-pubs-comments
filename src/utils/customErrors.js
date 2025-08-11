export class BadRequestError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
    this.code = 'BAD_REQUEST';
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    this.code = 'UNAUTHORIZED';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    this.code = 'CONFLICT';
    Error.captureStackTrace(this, this.constructor);
  }
}
