import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppExceptionFilter } from './app.exception-filter';

import { AppModule } from './app.module';
import { Seeder } from './app.seeder';
// import { AppExceptionFilter } from './app.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  // app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AppExceptionFilter());
  // app.flushLogs();

  const config = new DocumentBuilder()
    .setTitle('Public API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, doc);

  const server = await app.listen(parseInt(process.env.PORT || '3000', 10));

  try {
    const seeder = app.get(Seeder);

    await seeder.seed();

    console.log('Data seeding complete.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }

  console.log(`Listening on port  ${server.address().port}`);
}

bootstrap();
