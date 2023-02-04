import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from './entities/news.entity';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
import { FindNewsArgs } from './dto/find-news.args';
import { PaginatedNews } from './dto/paginatied-news';
import { UseGuards } from '@nestjs/common';
import { User } from './interfaces/user';
import { Roles } from '../role/decorators/roles.decorator';
import { RolesEnum } from '../role/enums/roles.enum';
import { RolesGuard } from '../role/guards/roles.guard';

@Resolver(() => News)
export class NewsResolver {
  constructor(private readonly newsService: NewsService) {}

  @Mutation(() => News)
  @Roles(RolesEnum.ModeratorOwn, RolesEnum.Moderator, RolesEnum.SecurityAdmin)
  @UseGuards(RolesGuard)
  createNews(
    @Args('createNewsInput')
    createNewsInput: CreateNewsInput,
    @Context('user') user: User,
  ) {
    return this.newsService.create(createNewsInput, user);
  }

  @Query(() => PaginatedNews, { name: 'news' })
  @UseGuards(RolesGuard)
  async findAll(
    @Args('options', { type: () => FindNewsArgs })
    args: FindNewsArgs,
    @Context('user') user: User,
  ) {
    return await this.newsService.findAll(args, user);
  }

  @Query(() => News, { name: 'news_one_by_id' })
  @UseGuards(RolesGuard)
  async findOne(
    @Args('id', { type: () => String }) id: string,
    @Context('user') user: User,
  ) {
    return this.newsService.findOneById(id, user);
  }

  @Mutation(() => News)
  @Roles(RolesEnum.ModeratorOwn, RolesEnum.Moderator, RolesEnum.SecurityAdmin)
  @UseGuards(RolesGuard)
  updateNews(
    @Args('updateNewsInput') updateNewsInput: UpdateNewsInput,
    @Context('user') user: User,
  ) {
    return this.newsService.update(updateNewsInput, user);
  }

  @Mutation(() => News)
  @Roles(RolesEnum.ModeratorOwn, RolesEnum.Moderator, RolesEnum.SecurityAdmin)
  @UseGuards(RolesGuard)
  removeNews(
    @Args('id', { type: () => String }) id: string,
    @Context('user') user: User,
  ) {
    return this.newsService.remove(id, user);
  }
}
