import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { DocumentData } from 'firebase-admin/firestore';
import { OrderDto } from 'src/dto/order.dto';
import { FirebaseAuthGuard } from 'src/firebase/firebase.auth.guard';
import { OrdersService } from './orders.service';

@UseGuards(FirebaseAuthGuard)
@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(OrdersService)
    private readonly ordersService: OrdersService
  ){}

  @Post('/new')
  async createOrder(@Body() orderData: OrderDto): Promise<DocumentData> {
    return await this.ordersService.createOrder(orderData)
  }

  @Get('/order/:orderId') 
  async getOrderData(@Param('orderId') orderId: string): Promise<DocumentData> {
    return await this.ordersService.getOrderData(orderId)
  }

}
