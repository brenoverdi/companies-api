import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CompanySearchObject } from '../../helpers/elasticsearch.config.helper';
import axios from 'axios';

@Injectable()
export class SearchService {
  constructor() {}
  private readonly elasticsearchUrl: string =
    process.env.ELASTICSEARCH_URL || 'http://localhost:9200';

  public async insertSingleDocument(doc: any): Promise<any> {
    try {
      const { ...docWithoutId } = doc; // Deconstruct doc to remove _id
      const response = await axios.post(
        `${this.elasticsearchUrl}/companies/_doc/`, // No need to pass _id in the URL
        docWithoutId,
        {
          timeout: 30000, // Set a long timeout to prevent timeout errors
        },
      );

      if (
        response.data.result !== 'created' &&
        response.data.result !== 'updated'
      ) {
        throw new HttpException(
          'Failed to insert document',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return response.data;
    } catch (err) {
      console.error('Error inserting document:', err);
      throw new HttpException(
        'Error while inserting document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async bulkInsertDocuments(docs: any[]): Promise<any> {
    try {
      const bulkRequestBody = [];
      for (const doc of docs) {
        bulkRequestBody.push({ index: { _index: 'companies' } }); // Add the action (index)
        bulkRequestBody.push(doc); // Add the document itself
      }

      // Convert the array to a newline-delimited JSON string (NDJSON)
      const bulkRequestString =
        bulkRequestBody
          .map((item) => JSON.stringify(item)) // Convert each item to JSON string
          .join('\n') + '\n'; // Join them with newlines

      const response = await axios.post(
        `${this.elasticsearchUrl}/companies/_bulk`, // Assuming this is your Elasticsearch URL
        bulkRequestString,
        {
          headers: {
            'Content-Type': 'application/x-ndjson', // Required for bulk requests
          },
          timeout: 30000, // Set a long timeout to prevent timeout errors
        },
      );

      // Step 4: Check if there are any errors in the response
      if (response.data.errors) {
        // Find failed items
        const failedItems = response.data.items.filter(
          (item) => item.index?.error,
        );
        throw new HttpException(
          `Failed to insert some documents: ${JSON.stringify(failedItems)}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Step 5: Return the successful response data
      return response.data;
    } catch (err) {
      console.error('Error while bulk inserting documents:', err);

      // Throw an exception if there was an error with the bulk insert
      throw new HttpException(
        'Error while bulk inserting documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
  public async updateIndex(updateData: any): Promise<any> {
    return await this.update(updateData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
      */
  public async searchIndex(searchData: any): Promise<any> {
    const data = CompanySearchObject.searchObject(searchData); // Assuming this returns your search query.

    try {
      const response = await axios.post(
        `${this.elasticsearchUrl}/companies/_search`, // The search URL, replace 'companies' with your index name.
        data.body, // The query body
        {
          headers: {
            'Content-Type': 'application/json', // Make sure the content type is set to JSON
          },
          timeout: 30000, // Optional: Set a timeout (in ms) for the request.
        },
      );

      // Extract hits from response data
      const hits = response.data.hits.hits;
      const searchReturn = [];
      for (const hit of hits) {
        searchReturn.push(hit._source);
      }
      return searchReturn; // Return the search results (hits)
    } catch (err) {
      console.error('Error during search:', err);
      throw new HttpException(
        'Internal server error while searching',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /*
  public async deleteIndex(indexData: any): Promise<any> {
    return await this.indices
      .delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }

  public async deleteDocument(indexData: any): Promise<any> {
    return await this.delete(indexData)
      .then((res) => res)
      .catch((err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
      */
}
