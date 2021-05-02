import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { UsersModule } from './users/users.module';
import * as dotenv from 'dotenv';
import * as sentry from '@sentry/node';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });
  if (process.env.NODE_ENV === 'production') {
    sentry.init({
      dsn: 'https://ca602143bd1c4e1584d5b9cd5781e06b@sentry.io/1783844',
    });
  }

  //
  let options;
  if (process.env.NODE_ENV === 'production') {
    options = new DocumentBuilder()
      .setTitle('Rajesh App')
      .setBasePath('/')
      .setVersion('v1')
      .addBearerAuth()
      .setSchemes('https')
      .build();
  } else {
    options = new DocumentBuilder()
      .setTitle('Rajesh App')
      .setBasePath('/')
      .setVersion('v1')
      .addBearerAuth()
      .build();
  }
  const document = SwaggerModule.createDocument(app, options, {
    include: [UsersModule],
  });
  SwaggerModule.setup('/explorer', app, document);
  await app.listen(process.env.PORT || 4000);
  console.log('http://localhost:4000/explorer/#/');
}
bootstrap();
