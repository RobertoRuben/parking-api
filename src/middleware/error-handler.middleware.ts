import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error handler middleware:', error);
  
  if (error instanceof HttpException) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      timestamp: new Date().toISOString(),
      errors: error.errors
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
}
