import { GraphQLError } from 'graphql';

import { CommonExceptionResponse } from '../interfaces';

export class GraphQLException extends GraphQLError {
  private readonly status: number;

  private readonly response: CommonExceptionResponse;

  constructor(exceptionResponse: CommonExceptionResponse) {
    const { errorStack, ...response } = exceptionResponse;
    const { errorCode, errorMessage, statusCode } = response;
    const extensions = { code: errorCode };
    super(errorMessage, null, null, null, null, null, extensions);
    this.status = statusCode;
    this.response = response;
    if (errorStack) {
      this.stack = errorStack;
    }
  }

  getStatus(): number {
    return this.status;
  }

  getResponse(): CommonExceptionResponse {
    const { errorCode, errorMessage, statusCode } = this.response;
    return {
      errorCode,
      errorMessage,
      statusCode,
      errorStack: this.stack,
    };
  }
}
