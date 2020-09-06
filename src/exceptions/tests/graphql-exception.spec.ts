import { InternalServerErrorException } from '@nestjs/common';

import { ErrorCode } from '../../constants';
import { CommonException } from '../common-exception';
import { GraphQLException } from '../graphql-exception';

describe('GraphQLException', () => {
  let graphQLException: GraphQLException;

  beforeAll(() => {
    const commonException = new CommonException({
      code: ErrorCode.INTERNAL_SERVER_ERROR,
      error: new InternalServerErrorException('Internal Error'),
    });
    graphQLException = new GraphQLException(commonException.getResponse());
  });

  it('should be defined', () => {
    const response = graphQLException.getResponse();
    delete response.errorStack;
    const exception = new GraphQLException(response);
    expect(exception).toBeDefined();
  });

  describe('getStatus', () => {
    it('should return `500` error status', () => {
      const status = graphQLException.getStatus();
      expect(status).toBe(500);
    });
  });

  describe('getResponse', () => {
    it('should return `CommonExceptionResponse`', () => {
      const response = graphQLException.getResponse();
      expect(response.statusCode).toBe(500);
      expect(response.errorCode).toBe('INTERNAL_SERVER_ERROR');
      expect(response.errorMessage).toBe('Internal Error');
      expect(response.errorStack).toContain('Error: Internal Error');
    });
  });
});
