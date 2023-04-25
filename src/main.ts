import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // parsehub string from php may be too large. need to expand
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  // app.enableCors({
  //   origin: [
  //     process.env.STAGE === 'prod'
  //       ? 'https://hockfm-fe.vercel.app'
  //       : 'http://localhost:4200',
  //   ],
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  // });
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
