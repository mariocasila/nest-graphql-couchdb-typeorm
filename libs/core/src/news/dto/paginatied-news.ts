import { Paginated } from '@core/core/utils/base/types/paginate';
import { ObjectType } from '@nestjs/graphql';
import { News } from '../entities/news.entity';

@ObjectType()
export class PaginatedNews extends Paginated(News) {}
