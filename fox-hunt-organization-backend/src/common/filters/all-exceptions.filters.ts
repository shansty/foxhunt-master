import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      (exception.getStatus && exception.getStatus()) || exception.status || 500;
    const message =
      (exception.getResponse && exception.getResponse()['message']) ||
      exception.message ||
      'Internal Server Error';

    this.logger.error({
      information: `Something went wrong`,
      url: request.url,
      body: request.body,
      message: Array.isArray(message) ? message[0] : message,
    });

    response.status(status).json({
      status: status,
      message: Array.isArray(message) ? message[0] : message,
      timestamp: new Date().toISOString(),
    });
  }
}
