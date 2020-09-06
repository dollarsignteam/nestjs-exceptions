import { InternalServerErrorException } from '@nestjs/common';

import { ErrorCode } from '../../constants';
import { CommonException } from '../common-exception';

describe('CommonException', () => {
  let commonException: CommonException;

  beforeAll(() => {
    commonException = new CommonException({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      error: new InternalServerErrorException('Internal Error'),
    });
  });

  it('should be defined', () => {
    expect(commonException).toBeDefined();
  });

  describe('getStatus', () => {
    it('should return `500` error status', () => {
      const status = commonException.getStatus();
      expect(status).toBe(500);
    });
  });

  describe('getResponse', () => {
    it('should return `CommonExceptionResponse`', () => {
      const response = commonException.getResponse();
      expect(response.statusCode).toBe(500);
      expect(response.errorCode).toBe('INTERNAL_SERVER_ERROR');
      expect(response.errorMessage).toBe('Internal Error');
      expect(response.errorStack).toContain('Error: Internal Error');
    });
  });
});
