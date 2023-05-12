import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/my-ecommerce-app', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }),
    ],
    controllers: [],
    providers: []
})
export class DatabaseModule {}



