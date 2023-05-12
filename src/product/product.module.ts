import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product, ProductSchema } from './product.schema';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
    JwtModule.register({
      secret: '12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
