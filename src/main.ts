import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { FastifyInstance, FastifyServerOptions, fastify } from 'fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as awsLambdaFastify from 'aws-lambda-fastify';

function swaggerConfig() {
  const config = new DocumentBuilder()
    .setTitle('API nest-serverless-fastify')
    .setDescription('Serviço serverless em nestjs utilizando fastify')
    .setVersion('1.0')
    .build();

  return config;
}

async function bootstrap() {
  const serverOptions: FastifyServerOptions = { logger: true };
  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
    {
      logger: ['log', 'debug', 'verbose', 'warn', 'error'], // Enables all log levels
    },
  );
  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, swaggerConfig());
  SwaggerModule.setup('docs', app, document);
  await app.init();
  return { app, instance };
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  const cachedNestApp = await bootstrap();
  const proxy = awsLambdaFastify(cachedNestApp.instance);
  return proxy(event, context, callback);
};
