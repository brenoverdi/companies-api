import { companyIndex } from './companies.elastic.helper';

export class ConfigSearch {
  public static searchConfig(url: string): any {
    return {
      node: url,
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: true,
    };
  }
}

export class ElasticSearchBody {
  size: number;
  from: number;
  query: any;

  constructor(size: number, from: number, query: any) {
    this.size = size;
    this.from = from;
    this.query = query;
  }
}

export class CompanySearchObject {
  public static searchObject(q: any) {
    const body = this.elasticSearchBody(q);
    return { index: companyIndex._index, body, q };
  }

  public static elasticSearchBody(q: any): ElasticSearchBody {
    const query = {
      bool: {
        should: [
          {
            match: {
              name: q, // Match against the 'name' field
            },
          },
          {
            match: {
              description: q, // Match against the 'description' field
            },
          },
          {
            match: {
              overview: q, // Match against the 'breed' field
            },
          },
        ],
        minimum_should_match: 1, // At least one of the conditions must be true
      },
    };

    return new ElasticSearchBody(1000, 0, query);
  }
}
