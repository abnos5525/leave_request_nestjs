import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { UserDto } from 'src/dto/user.dto';
import { HafezUserResponseDto } from 'src/dto/hafez-user-response.dto';

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
    // const { data } = await this.httpService.axiosRef.get(
    //   `/v1/positions/all-with-user-and-group`,
    // );
    return;
    // this.mapHafezUserToPositionUser(data);
  }

  mapHafezUserToPositionUser(data: HafezUserResponseDto[]): UserDto[] {
    return data.map((item): UserDto => {
      return {
        first_name: item.first_name || null,
        last_name: item.last_name || null,
        national_code: item.national_code || null,
        position_id: item.position_id || null,
        position_name: item.position_name || null,
        user_id: item.user_id || null,
        username: item.username || null,
      };
    });
  }
}
