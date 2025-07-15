import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { UserDto } from 'src/dto/user.dto';

@Injectable()
export class HafezService extends CoreService {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected loggerService: LoggerService,
  ) {
    super(httpService, loggerService, LogTypes.HAFEZ_REQUESTS);
  }

  async getUsers(): Promise<UserDto[]> {
    const response = await this.httpService.axiosRef.get(
      `/v1/positions/all-with-user-and-group`,
    );
    return response.data.data;
  }
}
