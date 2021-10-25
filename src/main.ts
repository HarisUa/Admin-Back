import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';
import { APP_CONFIG } from '@shared/config';
import { AppModule } from './app.module';
import { COMMON_HEADERS } from './common';
// to start server
async function bootstrap() {
  // create express server instance and enable cors
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  // disable x-powered-by response header
  app.disable('x-powered-by');
  // enable 10mb json payload
  app.use(json({ limit: '10mb' }));
  // set global prefix for apis
  app.setGlobalPrefix('api');
  // to log custom message on bootstrap
  const logger = new Logger('Bootstrap');
  // create config object for swagger document
  const config = new DocumentBuilder()
    .setTitle('Betfan Backend Admin')
    .setDescription('To provide access to different admin resources')
    .addTag('Auth', 'Authentication related APIs')
    .addTag('Banners', 'Banners related APIs')
    .addTag('Profile', 'User profile related APIs')
    .addTag('Roles', 'Roles related APIs')
    .addTag('Users', 'Users related APIs, to manage users')
    .addTag('Sub Banners', 'Sub Banners related APIs, to manage sub-banners')
    .addTag('Entertainments', 'Entertainments related APIs, to manage Entertainments')
    .addTag('Placements', 'Placements related APIs, to manage Placements')
    .addTag('Promotions', 'Promotions related APIs, to manage Promotions')
    .addTag('Regulations', 'Regulations related APIs, to manage Regulations')
    .addTag('Messages', 'Messages related APIs, to manage Messages')
    .addTag('Mybet', 'Mybet related APIs, to manage Mybet')
    .addTag('SB-BETTING', 'SB-BETTING APIs, to call sb-betting APIs to fetch data')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: COMMON_HEADERS.X_ACCESS_TOKEN,
        description: 'access token',
      },
      COMMON_HEADERS.X_ACCESS_TOKEN,
    )
    .build();
  // setup swagger to list on api-doc route
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  // start server
  await app.listen(APP_CONFIG.port);
  logger.log(`Server started on ${APP_CONFIG.port} port`);
}
bootstrap();
