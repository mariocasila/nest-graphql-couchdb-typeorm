import { NanoService } from '@core/core/nano/nano.service';
import { EntityHandler } from '@core/core/utils/base/entity-handler/entity-handler';
import {
  DataSource,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NewsCouchModel } from '../couch-models/news.couch.model';
import { CreateNewsInput } from '../dto/create-news.input';
import { FindNewsArgs } from '../dto/find-news.args';
import { News } from '../entities/news.entity';

export class NewsEntityHandler extends EntityHandler<
  News,
  NewsCouchModel,
  CreateNewsInput,
  FindNewsArgs
> {
  protected entityName = 'news';

  constructor(
    protected repo: Repository<News>,
    protected nanoService: NanoService,
    protected readonly dataSource: DataSource,
  ) {
    super(repo, nanoService, dataSource);
    this.entityTarget = News;
    this.initialize();
  }

  getFindOptions({
    page,
    pageSize,
    id,
    userId,
  }: FindNewsArgs): FindManyOptions<News> {
    const params: FindManyOptions<News> = { where: {} };
    const where = params.where as FindOptionsWhere<News>;

    if (page !== undefined && pageSize !== undefined) {
      params.take = pageSize;
      params.skip = page * pageSize;
    }

    if (id !== undefined) {
      where.id = id;
    }

    if (userId !== undefined) {
      where.userId = userId;
    }

    return params;
  }

  getFindByIdOptions(id: string): FindOptionsWhere<News> {
    return { id };
  }

  getCouchCreatableByEntity(item: News): NewsCouchModel {
    return new NewsCouchModel(item);
  }
}
