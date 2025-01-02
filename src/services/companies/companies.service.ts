import { Injectable } from '@nestjs/common';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schema/companies.schema';
import { SearchService } from '../search/search.service';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<Company>,
    private readonly searchService: SearchService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const create = new this.companyModel(createCompanyDto);
    const documentCreated = await create.save();
    await this.searchService.insertSingleDocument(documentCreated);
  }

  async findAll(q: string) {
    return await this.searchService.searchIndex(q);
  }

  findOne(id: number) {
    return `This action returns a #${id} cat`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const update = new this.companyModel(updateCompanyDto);
    const currentItem = this.companyModel.findById(id);
    //this.searchService.updateIndex(updateCompanyDto);
    return update.updateOne(currentItem, updateCompanyDto);
  }

  remove(id: number) {
    return `This action removes a #${id} cat`;
  }

  async indexDocuments() {
    const itemList = await this.companyModel.find({});
    const arrayToImport = [];
    for (const item of itemList) {
      const newObject = {
        name: item.name,
        permalink: item.permalink,
        crunchbase_url: item.crunchbase_url,
        homepage_url: item.homepage_url,
        blog_url: item.blog_url,
        blog_feed_url: item.blog_feed_url,
        twitter_username: item.twitter_username,
        category_code: item.category_code,
        number_of_employees: item.number_of_employees,
        founded_year: item.founded_year,
        founded_month: item.founded_month,
        founded_day: item.founded_day,
        deadpooled_year: item.deadpooled_year,
        tag_list: item.tag_list,
        alias_list: item.alias_list,
        email_address: item.email_address,
        phone_number: item.phone_number,
        description: item.description,
        created_at: item.created_at,
        updated_at: item.updated_at,
        overview: item.overview,
      };
      arrayToImport.push(newObject);
    }
    await this.searchService.bulkInsertDocuments(arrayToImport);
    return 'Indexed all documents';
  }
}
