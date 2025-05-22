import { Logger } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import {
  ADMIN_SERVICE_URLS,
  FEATURE_SERVICE_URLS,
  ORG_SERVICE_URLS,
} from '../constants/serviceUrls';
import 'dotenv/config';
import { configService } from '../../config/config.service';
import { MiddlewareConsumer } from '@nestjs/common';

class ProxyFactory {
  private readonly logger = new Logger('Proxy gateway');

  public consumerConnection(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        ProxyFactoryInstance.getProxyMiddleware(
          ORG_SERVICE_URLS,
          configService.getOrganizationUrl(),
        ),
        ProxyFactoryInstance.getProxyMiddleware(
          FEATURE_SERVICE_URLS,
          configService.getFeatureServiceUrl(),
        ),
        ProxyFactoryInstance.getProxyMiddleware(
          ADMIN_SERVICE_URLS,
          configService.getAdminUrl(),
        ),
      )
      .forRoutes('*');
  }

  private pathRewrite = (path, req) => {
    return path.replace('/api/v1', '').replace('org/', ''); // org must be removed after urls like /org/location-packages will be deleted
  };

  private getProxyMiddleware = (handledUrls: string[], target: string) => {
    return createProxyMiddleware(
      (pathname, req): boolean => {
        pathname = pathname.replace(`/api/v1`, '');
        let isHandledByService = false;
        handledUrls.forEach((item) => {
          if (pathname.startsWith(item)) {
            isHandledByService = true;
          }
        });
        return isHandledByService;
      },
      {
        target,
        pathRewrite: this.pathRewrite,
        onProxyReq: (proxyReq, req, res) => {
          this.logger.debug(
            `Proxying ${req.method} request originally made to '${req.originalUrl}  '`,
            `Was redirected to ${target}${req.url}`,
          );
        },
        onError: (err, req, res) => {
          this.logger.error(
            `Proxying ${req.method} request originally made to '${req.originalUrl}'`,
            `Was redirected to ${target}${req.url}`,
            `Error: ${err.message}`,
            '',
          );
          res.writeHead(500);
          res.end(
            JSON.stringify({
              status: 500,
              message: 'Something went wrong. Please, try later.',
              timestamp: new Date().toISOString(),
            }),
          );
        },
      },
    );
  };
}

export const ProxyFactoryInstance = new ProxyFactory();
