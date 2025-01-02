import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CompaniesModule } from './modules/companies.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchModule } from './modules/search.module';
import { AuthModule } from './modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { AuthMiddleware } from './middlewares/authorization.middleware';
import { CompaniesController } from './controllers/companies/companies.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), // This should be at the top level to make config available everywhere
    MongooseModule.forRoot(process.env.MONGODB_URL),
    CompaniesModule,
    SearchModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply LoggerMiddleware globally
    consumer.apply(LoggerMiddleware).forRoutes('*');

    consumer.apply(AuthMiddleware).forRoutes(CompaniesController);
  }
}
