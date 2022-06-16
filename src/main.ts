import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config/configuration';
import { HttpExceptionFilter } from './filters/exception.filter';

function configureSwagger(app: INestApplication) {
  const swaggerDocOptions = new DocumentBuilder()
    .setTitle('User-service')
    .setDescription('The user-service API description')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'JWT',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Type into the text box: Bearer {your JWT token}',
        in: 'header',
      },
      'JWT',
    )
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerDocOptions);
  SwaggerModule.setup('docs', app, swaggerDoc);
}

function configureValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  configureSwagger(app);
  configureValidation(app);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(config().port, () => {
    console.log(`app is running on port: ${config().port}`);
  });
}
bootstrap();
