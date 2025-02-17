export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class PredictionError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, 'PREDICTION_ERROR');
    this.name = 'PredictionError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, statusCode: number = 401) {
    super(message, statusCode, 'AUTH_ERROR');
    this.name = 'AuthError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  // Handle Prisma errors
  if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
    return {
      message: 'Database error occurred',
      statusCode: 500,
      code: 'DATABASE_ERROR',
    };
  }

  // Handle unknown errors
  console.error('Unhandled error:', error);
  return {
    message: 'An unexpected error occurred',
    statusCode: 500,
    code: 'INTERNAL_ERROR',
  };
}
