import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RoleService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Get Role by auth token
   */
  async getsByAuthToken(authenticateit_identity_ticket: string) {
    const shpingUrl = this.configService.get('SHPING_API_URL');

    try {
      const $response = this.httpService.request({
        method: 'GET',
        url: `${shpingUrl}/identity-service/session`,
        headers: { authenticateit_identity_ticket },
      });
      const response = await lastValueFrom($response);

      if (!response.data) {
        return null;
      }

      const { id, roles } = response.data;

      return { id, roles };
    } catch (error) {
      console.log(error);
    }

    return null;
  }
}
