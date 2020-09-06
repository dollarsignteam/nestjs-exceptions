import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

import { CommonExceptionHandler, GraphQLException } from '../exceptions';
import { CommonExceptionResponse } from '../interfaces';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const exceptionHandler = new CommonExceptionHandler(exception);
    const response = exceptionHandler.getResponse();
    if (host.getType() === 'http') {
      delete response.errorStack;
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      const req = ctx.getRequest<Request>();
      return this.httpResponse(req, res, response);
    }
    throw new GraphQLException(response);
  }

  httpResponse(
    req: Request,
    res: Response,
    response: CommonExceptionResponse,
  ): void {
    res.status(response.statusCode).json({
      ...response,
      path: req.url,
    });
  }
}
