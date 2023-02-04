import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { NanoService } from '../nano/nano.service';
import { CreateNewsInput } from './dto/create-news.input';
import { FindNewsArgs } from './dto/find-news.args';
import { UpdateNewsInput } from './dto/update-news.input';
import { News } from './entities/news.entity';
import { NewsEntityHandler } from './entity-handler/news.entity-handler';
import { User } from './interfaces/user';
import { RolesEnum } from '../role/enums/roles.enum';

@Injectable()
export class NewsService {
  private newsEntityHandler: NewsEntityHandler;

  constructor(
    @Inject(DataSource)
    private dataSource: DataSource,

    @InjectRepository(News) private newsRepo: Repository<News>,
    private configService: ConfigService,
    private nanoService: NanoService,
  ) {
    this.newsEntityHandler = new NewsEntityHandler(
      newsRepo,
      nanoService,
      dataSource,
    );
  }

  async create(createNewsInput: CreateNewsInput, user: User) {
    return this.newsEntityHandler.save({ ...createNewsInput, userId: user.id });
  }

  async findAll(findNewsInput: FindNewsArgs, user: User) {
    let role = user.roles.find((userRole) =>
      [RolesEnum.Moderator, RolesEnum.SecurityAdmin].find(
        (role) => role === userRole,
      ),
    );

    if (!role) {
      role = user.roles.find((userRole) =>
        [RolesEnum.ModeratorOwn, RolesEnum.Writer].find(
          (role) => role === userRole,
        ),
      );
      if (!role) {
        throw new ForbiddenException('Not permitted');
      }
      findNewsInput.userId = user.id;
    }

    return this.newsEntityHandler.find(findNewsInput);
  }

  async findOneById(id: string, user: User) {
    const findNewsInput: FindNewsArgs = { id };

    const role = user.roles.find((userRole) =>
      [RolesEnum.Moderator, RolesEnum.SecurityAdmin].find(
        (role) => role === userRole,
      ),
    );

    if (role) {
      findNewsInput.userId = user.id;
    }
    return this.newsEntityHandler.findOne(findNewsInput);
  }

  async update({ id, ...params }: UpdateNewsInput, user: User) {
    const item = await this.findOneById(id, user);
    if (!item) {
      throw new NotFoundException('Not found');
    }
    return this.newsEntityHandler.save({
      ...item,
      ...params,
      userId: user.id,
    });
  }

  async remove(id: string, user: User) {
    const item = await this.findOneById(id, user);
    if (!item) {
      throw new NotFoundException('Not found');
    }

    const securityAdminRole = user.roles.find(
      (userRole) => userRole === RolesEnum.SecurityAdmin,
    );
    if (!securityAdminRole) {
      const role = user.roles.find((userRole) =>
        [RolesEnum.Writer, RolesEnum.ModeratorOwn].find(
          (role) => role === userRole,
        ),
      );

      if (!role || user.id !== item.userId || item.status !== 'draft') {
        throw new ForbiddenException('Not permitted');
      }
    }

    await this.newsEntityHandler.delete(id);
    return item;
  }

  async empty() {
    return this.newsEntityHandler.delete(null);
  }
}
