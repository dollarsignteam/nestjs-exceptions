import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

import { CommonExceptionHandler } from '../exceptions/common-exception-handler';

@Catch()
export class GlobalRpcExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): Observable<unknown> {
    if (host.getType() === 'rpc') {
      const exceptionHandler = new CommonExceptionHandler(exception);
      const response = exceptionHandler.getResponse();
      return throwError(response);
    }
    return super.catch(exception, host);
  }
}
