export class Company {
  name: string;
  permalink: string;
  crunchbase_url: string;
  homepage_url: string;
  blog_url: string;
  blog_feed_url: string;
  twitter_username: string;
  category_code: string;
  number_of_employees: number;
  founded_year: number;
  founded_month: number;
  founded_day: number;
  deadpooled_year: number;
  tag_list: string;
  alias_list: string;
  email_address: string;
  phone_number: string;
  description: string;
  created_at: { $date: string };
  updated_at: string;
  overview: string;
}
