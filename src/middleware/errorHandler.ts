import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpConstants";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const maybe = err as { message?: string; statusCode?: number };

  const status = maybe.statusCode ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = maybe.message ?? "Internal Server Error";

  return res.status(status).json({ message });
}
