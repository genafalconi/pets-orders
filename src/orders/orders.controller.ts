import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderDto } from 'src/dto/order.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';
import { Order } from 'src/schemas/order.schema';
import { OrdersService } from './orders.service';
import { CustomRequest } from 'src/firebase/customRequest';

@UseGuards(FirebaseAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService,
  ) { }

  @Post('/new')
  async createOrder(@Body() orderData: OrderDto, @Req() req: CustomRequest): Promise<Order> {
    const token = req.headers?.authorization?.split(' ')[1];
    return await this.ordersService.createOrder(orderData, token);
  }

  @Get('/order/:orderId')
  async getOrderData(@Param('orderId') orderId: string): Promise<Order> {
    return await this.ordersService.getOrderData(orderId);
  }

  @Post('/msg')
  async send(@Param('orderId') orderId: string, @Req() req: CustomRequest) {
    const token = req.headers?.authorization?.split(' ')[1];
    return await this.ordersService.sendMessageOrder(orderId, token)
  }

  @Put('/delivered/:orderId') 
  async deliveredOffer(@Param('orderId') orderId: string) {
    return await this.ordersService.updateDeliverOrder(orderId)
  }
  @Put('/cancel/:orderId') 
  async cancelOffer(@Param('orderId') orderId: string) {
    return await this.ordersService.updateCancelOrder(orderId)
  }
}
