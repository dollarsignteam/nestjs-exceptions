export interface CommonExceptionResponse {
  errorCode: string;
  errorMessage: string;
  errorStack?: string;
  statusCode: number;
}
