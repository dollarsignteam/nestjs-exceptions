import { HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { isEmpty, isError, isObject, isString } from 'lodash';

import { ErrorCode } from '../constants';
import { CommonExceptionPayload, CommonExceptionResponse } from '../interfaces';

import { CommonException } from './common-exception';

export type CommonExceptionParam =
  | string
  | Error
  | CommonExceptionPayload
  | CommonExceptionResponse;

export class CommonExceptionHandler extends Error {
  private code: string;

  private status: number;

  private exception: string | Error;

  constructor(private readonly param: CommonExceptionParam) {
    super(CommonExceptionHandler.name);
    this.initException();
  }

  initException(): void {
    if (CommonExceptionHandler.isCommonExceptionResponse(this.param)) {
      const { errorCode, errorMessage, errorStack, statusCode } = this.param;
      this.code = errorCode;
      this.message = errorMessage;
      this.status = statusCode;
      this.stack = errorStack;
      return;
    }
    if (CommonExceptionHandler.isCommonExceptionPayload(this.param)) {
      this.code = this.param.code;
      this.exception = this.param.error;
    } else {
      this.code = CommonExceptionHandler.getErrorCode(this.param);
      this.exception = this.param;
    }
    this.message = CommonExceptionHandler.getErrorMessage(this.exception);
    this.status = CommonExceptionHandler.getStatusCode(this.exception);
    if (isError(this.exception)) {
      this.stack = this.exception.stack;
    }
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

  static getErrorCode(exception: unknown): string {
    if (
      exception instanceof HttpException ||
      exception instanceof CommonException
    ) {
      const response = exception.getResponse() as CommonExceptionResponse;
      const statusCode = exception.getStatus();
      return (response && response.errorCode) || HttpStatus[statusCode];
    }
    const param = exception as CommonExceptionParam;
    if (CommonExceptionHandler.isCommonExceptionResponse(param)) {
      return param.errorCode;
    }
    return isError(exception)
      ? ErrorCode.INTERNAL_SERVER_ERROR
      : ErrorCode.SOMETHING_WENT_WRONG;
  }

  static getErrorMessage(exception: unknown): string {
    if (isString(exception)) {
      return exception;
    }
    const param = exception as CommonExceptionParam;
    if (CommonExceptionHandler.isCommonExceptionResponse(param)) {
      return param.errorMessage;
    }
    if (exception instanceof CommonException) {
      return exception.message;
    }
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      return CommonExceptionHandler.getErrorMessage(response);
    }
    if (exception instanceof RpcException) {
      const error = exception.getError();
      return CommonExceptionHandler.getErrorMessage(error);
    }
    const error = exception as Error;
    if (error && error.message) {
      return error.message;
    }
    if (!isEmpty(exception) && isObject(exception)) {
      return JSON.stringify(exception);
    }
    return 'Something went wrong';
  }

  static getStatusCode(exception: unknown): number {
    const param = exception as CommonExceptionParam;
    if (param instanceof HttpException || param instanceof CommonException) {
      return param.getStatus();
    }
    if (CommonExceptionHandler.isCommonExceptionResponse(param)) {
      return param.statusCode;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  static isCommonExceptionPayload(
    param: CommonExceptionParam,
  ): param is CommonExceptionPayload {
    const payload = param as CommonExceptionPayload;
    return !!(payload && payload.code && payload.error);
  }

  static isCommonExceptionResponse(
    param: CommonExceptionParam,
  ): param is CommonExceptionResponse {
    const response = param as CommonExceptionResponse;
    return !!(
      response &&
      response.errorCode &&
      response.errorMessage &&
      response.statusCode
    );
  }
}
