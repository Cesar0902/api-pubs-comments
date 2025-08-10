export class BadRequestError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
    this.statusCode = 409;
    Error.captureStackTrace(this, this.constructor);
  }
}
