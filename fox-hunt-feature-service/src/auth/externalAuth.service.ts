import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { configService } from '../config/config.service';

@Injectable()
export class ExternalAuthService {
  private readonly logger = new Logger(ExternalAuthService.name);

  payload: string;

  public getPayloadHeader = async (): Promise<string> => {
    try {
      if (!this.payload) {
        this.logger.log('Request to get payload header');
        const { data } = await configService.getAxiosExternalAuth();
        this.payload = JSON.stringify(data);
      }
      return this.payload;
    } catch (err) {
      this.logger.error(`Error in request to get payload header`);
      throw new BadGatewayException(err);
    }
  };
}
