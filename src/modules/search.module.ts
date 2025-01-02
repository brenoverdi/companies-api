import { Module } from '@nestjs/common';
import { SearchService } from '../services/search/search.service';

@Module({
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
