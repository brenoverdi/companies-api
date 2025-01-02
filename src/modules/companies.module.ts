import { Module } from '@nestjs/common';
import { CompaniesService } from '../services/companies/companies.service';
import { CompaniesController } from '../controllers/companies/companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Company,
  CompanySchema,
} from '../services/companies/schema/companies.schema';
import { SearchModule } from './search.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    SearchModule,
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
