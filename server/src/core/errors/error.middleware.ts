import { Request, Response, NextFunction } from "express";
import { ApiError } from "./custom-errors";

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    const payload: any = {
      success: false,
      code: err.code,
      message: err.message,
    };
    return res.status(err.statusCode).json(payload);
  }

  console.error(err);
  const payload: any = {
    success: false,
    code: "INTERNAL",
    message: "Internal Server Error",
  };

  return res.status(500).json(payload);
}
