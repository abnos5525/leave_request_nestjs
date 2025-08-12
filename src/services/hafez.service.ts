import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CoreService } from '../common/services/core.service';
import { LoggerService } from '../common/services/logger.service';
import { LogTypes } from '../common/types/logger';
import { PaginationDto } from 'src/dto/pagination.dto';
import { HTTPS_AGENT_OPTIONS } from 'src/common/utils/agent';

@Injectable()
export class HafezService extends CoreService {
  private readonly baseUrl: string;
  constructor(
    protected httpService: HttpService,
    protected configService: ConfigService,
    protected loggerService: LoggerService,
  ) {
    super(httpService, loggerService, LogTypes.HAFEZ_REQUESTS);
    this.baseUrl = this.configService.get<string>('hafez.url');
  }

  async getUsers(request: PaginationDto) {
    const queryParams = new URLSearchParams();
    if (request.page !== undefined) {
      queryParams.append('page', request.page.toString());
    } else {
      queryParams.append('page', '0');
    }
    if (request.size !== undefined) {
      queryParams.append('size', request.size.toString());
    } else {
      queryParams.append('size', '10');
    }

    const url = `${this.baseUrl}/v1/users/?${queryParams.toString()}`;

    try {
      const response = await this.httpService.axiosRef.get(url, {
        ...HTTPS_AGENT_OPTIONS,
      });
      return response.data || { data: [] };
    } catch (error) {
      this.loggerService['error']?.error?.(
        `HafezService: Failed to fetch users from ${url}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
