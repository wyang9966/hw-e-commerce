import { ErrorCode } from "./error-codes";

export class ApiError extends Error {
  statusCode: number;
  code: ErrorCode | string;
  isOperational: boolean;

  constructor(statusCode: number, message: string, code: ErrorCode | string = ErrorCode.INTERNAL, isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message, ErrorCode.NOT_FOUND);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message, ErrorCode.BAD_REQUEST);
  }
}
