// import { ErrorResponse } from '../Types/ErrorResponse';

// export const ERROR_RESPONSES: Record<string, ErrorResponse> = {
//   UNAUTHORIZED: { code: 401, message: 'Unauthorized access' },
//   FORBIDDEN: { code: 403, message: 'Forbidden' },
//   NOT_FOUND: { code: 404, message: 'Resource not found' },
//   INTERNAL_ERROR: { code: 500, message: 'Internal server error' },
//   BAD_REQUEST: { code: 400, message: 'Bad request' },
// };

export class DecryptionError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = 'DecryptionError';
  }
}

export class ValidationError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DidCreationError extends Error {
  constructor(
    public code: number,
    public errorTxt: string,
    message: string,
  ) {
    super(message);
    this.name = 'DidCreationError';
  }
}

export class KiltTransactionError extends Error {
  constructor(
    public code: number,
    public errorTxt: string,
    message: string,
  ) {
    super(message);
    this.name = 'TransactionFailed';
  }
}
