import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './common/cron-jobs/tasks.module';
import { DeactivationModule } from './deactivation/deactivation.module';
import { ProxyFactoryInstance } from './common/services/proxyFactory.service';
import { DecodeTokenMiddleware } from './common/middlewares/decodeToken.middleware';
import { TokenService } from './common/services/token.service';
import { json } from 'body-parser';
import { TypeOrmConfigService } from './common/services/typeorm.service';

@Module({
  imports: [
    LoginModule,
    RegisterModule,
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    TasksModule,
    DeactivationModule,
  ],
  controllers: [],
  providers: [TokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DecodeTokenMiddleware).forRoutes('*');
    ProxyFactoryInstance.consumerConnection(consumer);
    consumer.apply(json()).forRoutes('*');
  }
}
