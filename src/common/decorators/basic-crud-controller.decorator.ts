import { applyDecorators, Controller, UseGuards } from '@nestjs/common';
import {
  AuthOptions,
  BaseRouteName,
  Crud,
  CrudAuth,
  DtoOptions,
  JoinOptions,
  ParamOption,
} from '@dataui/crud';
import { AuthGuard } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateInterceptor } from '../interceptors/create.interceptor';
import { UpdateInterceptor } from '../interceptors/update.interceptor';

export type CrudControllerParam = {
  apiTag: string;
  apiUrl: string;
  model: any;
  routes?: BaseRouteName[];
  join?: JoinOptions;
  primaryKey?: string;
  primaryKeyOptions?: ParamOption;
  alwaysPaginate?: boolean;
  paginateLimit?: number;
  decorators?: CrudControllerDecorators;
  dto?: DtoOptions;
  crudAuth?: AuthOptions;
};

export type CrudControllerDecorators = {
  getOneBase?: any[];
  getManyBase?: any[];
  createOneBase?: any[];
  createManyBase?: any[];
  updateOneBase?: any[];
  deleteOneBase?: any[];
};

export function BasicCrudController({
  apiTag,
  apiUrl,
  model,
  routes = [
    'getOneBase',
    'getManyBase',
    'createOneBase',
    'updateOneBase',
    'deleteOneBase',
  ],
  join = {},
  primaryKey = 'id',
  primaryKeyOptions = {
    field: 'id',
    type: 'string',
    primary: true,
  },
  alwaysPaginate = true,
  paginateLimit = 10,
  decorators = null,
  dto = null,
  crudAuth = null,
}: CrudControllerParam) {
  const routesWithOption = Object.assign(
    {},
    ...routes.map((route) => {
      switch (route) {
        case 'getOneBase': {
          return {
            [route]: {
              decorators: [...(decorators?.getOneBase || [])],
            },
          };
        }
        case 'getManyBase': {
          return {
            [route]: {
              decorators: [...(decorators?.getManyBase || [])],
            },
          };
        }
        case 'createOneBase': {
          return {
            [route]: {
              decorators: [...(decorators?.createOneBase || [])],
              interceptors: [CreateInterceptor],
            },
          };
        }
        case 'updateOneBase': {
          return {
            [route]: {
              allowParamsOverride: true,
              decorators: [...(decorators?.updateOneBase || [])],
              interceptors: [UpdateInterceptor],
            },
          };
        }
        case 'deleteOneBase': {
          return {
            [route]: {
              returnDeleted: true,
              decorators: [...(decorators?.deleteOneBase || [])],
            },
          };
        }
      }
    }),
  );
  return applyDecorators(
    CrudAuth(crudAuth),
    Crud({
      query: {
        join: join,
        alwaysPaginate: alwaysPaginate,
        limit: paginateLimit,
        exclude: ['id'],
      },
      model: {
        type: model,
      },
      dto: dto,
      routes: {
        only: routes,
        ...routesWithOption,
      },
      params: {
        [primaryKey]: primaryKeyOptions,
      },
    }),
    ApiTags(apiTag),
    Controller(apiUrl),
    ApiBearerAuth('keycloak-auth'),
    ApiBearerAuth('bearer-auth'),
    UseGuards(AuthGuard),
  );
}
