import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'nest-keycloak-connect';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import { SampleEntity } from '../entities/sample.entity';
import { SampleService } from '../services/sample.service';

@Crud({
  query: {
    join: {
      parent: {},
    },
    alwaysPaginate: true,
    limit: 10,
  },
  model: {
    type: SampleEntity,
  },
  routes: {
    only: [
      'getOneBase',
      'getManyBase',
      'createOneBase',
      'updateOneBase',
      'deleteOneBase',
    ],
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
})
@ApiTags('sample')
@Controller('v1/sample')
@ApiBearerAuth('keycloak-auth')
@ApiBearerAuth('bearer-auth')
@UseGuards(AuthGuard)
export class SampleController implements CrudController<SampleEntity> {
  constructor(public service: SampleService) {}

  get base(): CrudController<SampleEntity> {
    return this;
  }

  @Override()
  async getOne(@ParsedRequest() req: CrudRequest): Promise<SampleEntity> {
    return this.base.getOneBase(req);
  }

  @Override()
  async getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<SampleEntity> | SampleEntity[]> {
    return this.base.getManyBase(req);
  }

  @Override()
  @ApiBody({ type: SampleEntity })
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: SampleEntity,
  ): Promise<SampleEntity> {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  @ApiBody({ type: SampleEntity })
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: SampleEntity,
  ): Promise<SampleEntity> {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
  ): Promise<void | SampleEntity> {
    return this.base.deleteOneBase(req);
  }
}
