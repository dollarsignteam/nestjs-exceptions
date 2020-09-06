import { CommonExceptionPayload, CommonExceptionResponse } from '../interfaces';

import { CommonExceptionHandler } from './common-exception-handler';

export class CommonException extends Error {
  private readonly code: string;

  private readonly status: number;

  constructor(payload: CommonExceptionPayload) {
    const exceptionHandler = new CommonExceptionHandler(payload);
    const response = exceptionHandler.getResponse();
    const { errorCode, errorMessage, statusCode } = response;
    super(errorMessage);
    this.code = errorCode;
    this.status = statusCode;
  }

  getStatus(): number {
    return this.status;
  }

  getResponse(): CommonExceptionResponse {
    const { code, message, status, stack } = this;
    return {
      errorCode: code,
      errorMessage: message,
      statusCode: status,
      errorStack: stack,
    };
  }
}
