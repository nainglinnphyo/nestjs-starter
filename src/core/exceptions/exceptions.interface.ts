export interface IException {
  message: string;
  code?: number;
  cause?: Error;
  description?: string;
}

export interface IHttpBadRequestExceptionResponse {
  success: boolean;
  code: number;
  message: string;
  description: string;
  timestamp: string;
  traceId: string;
}

export interface IHttpInternalServerErrorExceptionResponse {
  success: boolean;
  code: number;
  message: string;
  description: string;
  timestamp: string;
  traceId: string;
}

export interface IHttpUnauthorizedExceptionResponse {
  success: boolean;
  code: number;
  message: string;
  description: string;
  timestamp: string;
  traceId: string;
}

export interface IHttpForbiddenExceptionResponse {
  success: boolean;
  code: number;
  message: string;
  description: string;
  timestamp: string;
  traceId: string;
}
