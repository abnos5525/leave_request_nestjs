import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';

export const ApiResponsePaginated = <T extends Type<any>>(dto: T) => {
  return applyDecorators(
    ApiExtraModels(dto),
    ApiResponse({
      status: 200,
      schema: {
        allOf: [
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dto) },
              },
              count: {
                type: 'number',
              },
              total: {
                type: 'number',
              },
              page: {
                type: 'number',
              },
              pageCount: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
  );
};
