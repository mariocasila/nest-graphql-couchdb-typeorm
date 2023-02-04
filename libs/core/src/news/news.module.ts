import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsResolver } from './news.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NanoModule } from '../nano/nano.module';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([News]), NanoModule, RoleModule],
  providers: [NewsResolver, NewsService],
})
export class NewsModule {}
