export interface IException {
  message: string;
  code?: number;
  cause?: Error;
  description?: string;
}

export interface IHttpBadRequestExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}

export interface IHttpInternalServerErrorExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}

export interface IHttpUnauthorizedExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}

export interface IHttpForbiddenExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}

export interface IHttpNotFoundExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}

export interface IHttpGatewayTimeOutExceptionResponse {
  _metadata: {
    code: number;
    message: string;
    description?: string;
    timestamp: string;
    traceId: string;
    path: string;
  };
}
