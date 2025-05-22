import { HttpException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class AxiosService {
  private readonly logger = new Logger('Proxy gateway');

  public async sendAxiosRequest(req: any, url: string): Promise<AxiosResponse> {
    try {
      this.logger.debug(`Request to ${url}`);
      delete req.headers['content-length'];
      return await axios(url, {
        method: req.method,
        data: req.body,
        headers: req.headers,
      });
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Something went wrong',
        err.response?.status || 500,
      );
    }
  }
}
