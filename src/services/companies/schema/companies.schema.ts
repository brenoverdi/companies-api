import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'companies' })
export class Company extends Document {
  @Prop()
  name: string;

  @Prop()
  permalink: string;

  @Prop()
  crunchbase_url: string;

  @Prop()
  homepage_url: string;

  @Prop()
  blog_url: string;

  @Prop()
  blog_feed_url: string;

  @Prop()
  twitter_username: string;

  @Prop()
  category_code: string;

  @Prop()
  number_of_employees: number;

  @Prop()
  founded_year: number;

  @Prop()
  founded_month: number;

  @Prop()
  founded_day: number;

  @Prop()
  deadpooled_year: number;

  @Prop()
  tag_list: string;

  @Prop()
  alias_list: string;

  @Prop()
  email_address: string;

  @Prop()
  phone_number: string;

  @Prop()
  description: string;

  @Prop()
  created_at: string;

  @Prop()
  updated_at: string;

  @Prop()
  overview: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
