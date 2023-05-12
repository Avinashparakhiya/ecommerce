import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './order.schema';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UserModule,
    ProductModule,
    JwtModule.register({
      secret: '12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
