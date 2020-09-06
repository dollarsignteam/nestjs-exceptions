import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { ErrorCode } from '../../constants';
import {
  CommonExceptionPayload,
  CommonExceptionResponse,
} from '../../interfaces';
import { CommonException } from '../common-exception';
import { CommonExceptionHandler } from '../common-exception-handler';

describe('CommonExceptionHandler', () => {
  let internalErrorExceptionPayload: CommonExceptionPayload;
  let notFoundExceptionResponse: CommonExceptionResponse;
  let unauthorizedExceptionPayload: CommonExceptionPayload;
  let internalErrorHandler: CommonExceptionHandler;
  let notFoundExceptionHandler: CommonExceptionHandler;
  let unauthorizedException: CommonException;

  beforeAll(() => {
    internalErrorExceptionPayload = {
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      error: new Error('Internal Error'),
    };
    notFoundExceptionResponse = {
      errorCode: 'NOT_FOUND',
      errorMessage: 'Not found',
      errorStack: 'Error: Not found',
      statusCode: HttpStatus.NOT_FOUND,
    };
    unauthorizedExceptionPayload = {
      code: 'UNAUTHORIZED',
      error: new UnauthorizedException(),
    };
    internalErrorHandler = new CommonExceptionHandler(
      internalErrorExceptionPayload,
    );
    notFoundExceptionHandler = new CommonExceptionHandler(
      notFoundExceptionResponse,
    );
    unauthorizedException = new CommonException(unauthorizedExceptionPayload);
  });

  describe('isCommonExceptionPayload', () => {
    it('should return false when exception is null', () => {
      const result = CommonExceptionHandler.isCommonExceptionPayload(null);
      expect(result).toBeFalsy();
    });

    it('should return true when exception is `internalErrorExceptionPayload`', () => {
      const result = CommonExceptionHandler.isCommonExceptionPayload(
        internalErrorExceptionPayload,
      );
      expect(result).toBeTruthy();
    });
  });

  describe('isCommonExceptionResponse', () => {
    it('should return false when exception is null', () => {
      const result = CommonExceptionHandler.isCommonExceptionResponse(null);
      expect(result).toBeFalsy();
    });

    it('should return true when exception is `notFoundExceptionResponse`', () => {
      const result = CommonExceptionHandler.isCommonExceptionResponse(
        notFoundExceptionResponse,
      );
      expect(result).toBeTruthy();
    });
  });

  describe('initException', () => {
    it('should return `stack: Error: Message` when exception is `Message` string', () => {
      const handler = new CommonExceptionHandler('Message');
      expect(handler.stack).toContain('Error: Message');
    });

    it('should return `stack: Error: Not found` when exception is `notFoundExceptionResponse`', () => {
      const handler = new CommonExceptionHandler(notFoundExceptionResponse);
      expect(handler.stack).toContain('Error: Not found');
    });

    it('should return `stack: Error: Internal Error` when exception is `internalErrorExceptionPayload`', () => {
      const handler = new CommonExceptionHandler(internalErrorExceptionPayload);
      expect(handler.stack).toContain('Error: Internal Error');
    });
  });

  describe('getResponse', () => {
    it('should return `CommonExceptionResponse`', () => {
      const response = internalErrorHandler.getResponse();
      expect(Object.keys(response)).toEqual([
        'errorCode',
        'errorMessage',
        'statusCode',
        'errorStack',
      ]);
    });
  });

  describe('getStatusCode', () => {
    it('should return `404` when exception is `notFoundExceptionHandler` response', () => {
      const response = notFoundExceptionHandler.getResponse();
      const status = CommonExceptionHandler.getStatusCode(response);
      expect(status).toBe(404);
    });

    it('should return `500` when exception is `Error`', () => {
      const exception = new Error('Error');
      const status = CommonExceptionHandler.getStatusCode(exception);
      expect(status).toBe(500);
    });

    it('should return `401` when exception is `unauthorizedException`', () => {
      const status = CommonExceptionHandler.getStatusCode(
        unauthorizedException,
      );
      expect(status).toBe(401);
    });
  });

  describe('getErrorCode', () => {
    it('should return `SOMETHING_WENT_WRONG` when exception is string', () => {
      const code = CommonExceptionHandler.getErrorCode('Error');
      expect(code).toBe('SOMETHING_WENT_WRONG');
    });

    it('should return `INTERNAL_SERVER_ERROR`, then exception is `Error`', () => {
      const exception = new Error('Error');
      const code = CommonExceptionHandler.getErrorCode(exception);
      expect(code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should return `UNAUTHORIZED`, then exception is `UnauthorizedException`', () => {
      const exception = new UnauthorizedException();
      const code = CommonExceptionHandler.getErrorCode(exception);
      expect(code).toBe('UNAUTHORIZED');
    });

    it('should return `INTERNAL_SERVER_ERROR`, then exception is `internalErrorHandler`', () => {
      const code = CommonExceptionHandler.getErrorCode(internalErrorHandler);
      expect(code).toBe('INTERNAL_SERVER_ERROR');
    });

    it('should return `INTERNAL_SERVER_ERROR` when exception is `internalErrorHandler` response', () => {
      const response = internalErrorHandler.getResponse();
      const code = CommonExceptionHandler.getErrorCode(response);
      expect(code).toBe('INTERNAL_SERVER_ERROR');
    });
  });

  describe('getErrorMessage', () => {
    it('should return string when exception is string', () => {
      const message = CommonExceptionHandler.getErrorMessage('Error');
      expect(message).toBe('Error');
    });

    it('should return `Internal Error` when exception is `internalErrorHandler` response', () => {
      const response = internalErrorHandler.getResponse();
      const message = CommonExceptionHandler.getErrorMessage(response);
      expect(message).toBe('Internal Error');
    });

    it('should return `Unauthorized` when exception is `unauthorizedException`', () => {
      const message = CommonExceptionHandler.getErrorMessage(
        unauthorizedException,
      );
      expect(message).toBe('Unauthorized');
    });

    it('should return `Rpc Error` when exception is `RpcException`', () => {
      const exception = new RpcException('Rpc Error');
      const message = CommonExceptionHandler.getErrorMessage(exception);
      expect(message).toBe('Rpc Error');
    });

    it('should return stringify object when exception is object', () => {
      const exception = { error: 'Error' };
      const message = CommonExceptionHandler.getErrorMessage(exception);
      expect(message).toBe(JSON.stringify(exception));
    });

    it('should return `something went wrong` when exception is `null`', () => {
      const message = CommonExceptionHandler.getErrorMessage(null);
      expect(message).toBe('Something went wrong');
    });
  });
});
