import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private userService: UserService,
  ) {}

  async create(productDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(productDto);
    return createdProduct.save();
     
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException({ message: 'Product not found', statusCode: 404 });
    }
    return product;
  }

  async update(id: string, productDto: UpdateProductDto): Promise<Product> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(id, productDto, { new: true });
    if (!updatedProduct) {
      throw new NotFoundException({ message: 'Product not found', statusCode: 404 });
    }
    throw new NotFoundException({ message: 'Product Update Successfully', statusCode: 200 });
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      throw new NotFoundException({ message: 'Product not found', statusCode: 404 });
    }
    throw new NotFoundException({ message: 'Product Delete Successfully', statusCode: 200 });
  }
}
