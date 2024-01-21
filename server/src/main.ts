import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
  });
  app.use(
    session({
      name: 'siwe-integration',
      secret: 'siwe-integration-secret',
      resave: true,
      saveUninitialized: true,
      cookie: { sameSite: true },
    }),
  );
  app.use(express.static(`${__dirname}/../../../client/build`));

  // For any other route, serve the 'index.html' file
  app.use(
    '/profile',
    express.static(`${__dirname}/../../../client/build/index.html`),
  );
  await app.listen(3001);
}
bootstrap();
