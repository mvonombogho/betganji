import { logger } from '../logging/logger';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class MLError extends AppError {
  constructor(message: string, code: string, context?: any) {
    super(message, `ML_${code}`, 500, context);
    this.name = 'MLError';
  }
}

export class ClaudeError extends AppError {
  constructor(message: string, code: string, context?: any) {
    super(message, `CLAUDE_${code}`, 500, context);
    this.name = 'ClaudeError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: any) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export function handleError(error: Error | AppError, context?: any) {
  if (error instanceof AppError) {
    logger.error(error.message, error, { ...error.context, ...context });
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode
    };
  }

  // Unknown errors
  logger.error('Unexpected error occurred', error, context);
  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500
  };
}

export function wrapAsyncHandler(handler: Function) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error as Error);
    }
  };
}
