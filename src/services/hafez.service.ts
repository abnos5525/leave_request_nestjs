import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';

@Injectable()
export class HafezService extends CoreService {
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected loggerService: LoggerService,
  ) {
    super(httpService, loggerService, LogTypes.HAFEZ_REQUESTS);
  }

  async getProfile(clientToken: string) {
    const { data } = await this.httpService.axiosRef.get(
      `/v1/users/profile/me`,
      {
        auth: null,
        headers: {
          Authorization: clientToken,
        },
      },
    );

    return {
      username: data.username || null,
      first_name: data.person?.first_name || null,
      last_name: data.person?.last_name || null,
      national_code: data.person?.national_code || null,
      avatar: data.person?.avatar_full_address || null,
    };
  }
}
