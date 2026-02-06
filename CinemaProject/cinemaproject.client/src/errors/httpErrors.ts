export class HttpError extends Error {
  public status: number;
  public statusText: string;

  constructor(
    status: number,
    message: string,
    statusText: string = ''
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message, 'Bad Request');
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'Forbidden');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(404, message, 'Not Found');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Conflict') {
    super(409, message, 'Conflict');
    this.name = 'ConflictError';
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, 'Internal Server Error');
    this.name = 'InternalServerError';
  }
}

export class ParseError extends Error {
  public details?: string;

  constructor(message: string = 'Failed to parse response', details?: string) {
    super(message);
    this.name = 'ParseError';
    this.details = details;
  }
}