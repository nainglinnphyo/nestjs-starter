import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

export class ResponseDto<T> {
  readonly result?: T;
  readonly count?: number;
  readonly currentPage?: number;
  readonly totalPage?: number;

  constructor(
    public readonly message: string,
    public readonly data?: T,
    pagination?: {
      count: number;
      page: number;
      size: number;
    }
  ) {
    if (pagination) {
      this.result = this.data;
      this.data = undefined;
      this.count = pagination.count;
      this.currentPage = (pagination.page - 1) * pagination.size + 1;
      this.totalPage = Math.ceil(pagination.count / pagination.size);
    }
  }
}

export class TopperResponseDto<T> extends ResponseDto<T> {
  readonly imagePath: string;

  constructor(
    public readonly message: string,
    public readonly data?: T,
    pagination?: {
      count: number;
      page: number;
      size: number;
    }
  ) {
    super(message, data, pagination);
  }
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
              isArray: {
                type: "boolean",
              },
              path: {
                type: "string",
              },
              duration: {
                type: "string",
              },
              method: {
                type: "string",
              },
              count: {
                type: "number",
              },
              currentPage: {
                type: "number",
              },
              totalPage: {
                type: "number",
              },
            },
          },
        ],
      },
    })
  );
};

export const ApiCustomResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
              isArray: {
                type: "boolean",
              },
              path: {
                type: "string",
              },
              duration: {
                type: "string",
              },
              method: {
                type: "string",
              },
            },
          },
        ],
      },
    })
  );
};
