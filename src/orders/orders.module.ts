import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [ConfigModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'AUTH_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: configService.get('AUTH_SERVICE_PORT'),
          },
        }),
    },
    {
      provide: 'CART_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('CART_SERVICE_HOST'),
            port: configService.get('CART_SERVICE_PORT'),
          },
        }),
    },
    {
      provide: 'PROD_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('PROD_SERVICE_HOST'),
            port: configService.get('PROD_SERVICE_PORT'),
          },
        }),
    },
    {
      provide: 'OFFERS_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('OFFERS_SERVICE_HOST'),
            port: configService.get('OFFERS_SERVICE_PORT'),
          },
        }),
    },
  ],
})
export class OrdersModule {}
