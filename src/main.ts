import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create Swagger document options
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('API documentation for the E-commerce application')
    .setVersion('1.0')
    .build();

  // Generate Swagger JSON document
  const document = SwaggerModule.createDocument(app, config);

  // Add Swagger middleware
  SwaggerModule.setup('api', app, document);

  const port = 3000;
  await app.listen(port);
  console.log(`Server started on port ${port}`);
}
bootstrap();
