import { NanoService } from '@core/core/nano/nano.service';
import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseCouchModel } from '../couch-model/base-couch-model';

export abstract class EntityHandler<
  TEntity,
  TCouchModel extends BaseCouchModel,
  TCreateDto extends DeepPartial<TEntity>,
  TFindDto,
> {
  protected abstract readonly entityName: string;
  protected entityTarget: EntityTarget<TEntity>;

  constructor(
    protected repo: Repository<TEntity>,
    protected nanoService: NanoService,
    protected dataSource: DataSource,
  ) {}

  /**
   * Initialize
   */
  async initialize() {
    this.nanoService.createDBIfNeeded(this.entityName);
  }

  /**
   * Handle saving entity
   */
  async save(createDto: TCreateDto): Promise<TEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(this.entityTarget);
      const item = await repo.save(createDto);
      await this.nanoService.insert(
        this.entityName,
        this.getCouchCreatableByEntity(item),
      );

      return item;
    });
  }

  /**
   * Handle finding entities
   */
  async find(findDto: TFindDto) {
    const options = this.getFindOptions(findDto);
    const [data, total] = await this.repo.findAndCount(options);

    return { data, total };
  }

  /**
   * Handle finding entity
   */
  async findOne(findDto: TFindDto) {
    const options = this.getFindOptions(findDto);
    return await this.repo.findOne(options);
  }

  /**
   * Handle finding entitiy by id
   */
  async findById(id: string) {
    const optionsWhere = this.getFindByIdOptions(id);
    return this.repo.findOneBy(optionsWhere);
  }

  /**
   * Handle finding entitiy by id
   */
  async delete(id?: string) {
    return await this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(this.entityTarget);
      const optionsWhere = id ? this.getFindByIdOptions(id) : {};

      await repo.delete(optionsWhere);
      await this.nanoService.delete(this.entityName, id);

      return true;
    });
  }

  /**
   * Handle get finding options for typeorm
   */
  abstract getFindOptions(findDto: TFindDto): FindManyOptions<TEntity>;

  /**
   * Handle get finding one by id options for typeorm
   */
  abstract getFindByIdOptions(id: string): FindOptionsWhere<TEntity>;

  /**
   * Get Couch creatable model instance by typeorm entity
   */
  abstract getCouchCreatableByEntity(item: TEntity): TCouchModel;
}
