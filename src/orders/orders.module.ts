import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from 'src/schemas/address.schema';
import { Cart, CartSchema } from 'src/schemas/cart.schema';
import { Lock, LockSchema } from 'src/schemas/lock.schema';
import { Offer, OfferSchema } from 'src/schemas/offers.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';
import { Subproduct, SubproductSchema } from 'src/schemas/subprod.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Cart.name, schema: CartSchema },
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Address.name, schema: AddressSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Subproduct.name, schema: SubproductSchema },
      { name: Offer.name, schema: OfferSchema },
      { name: Lock.name, schema: LockSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
