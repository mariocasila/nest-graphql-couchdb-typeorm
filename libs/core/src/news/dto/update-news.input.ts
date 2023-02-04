import { CreateNewsInput } from './create-news.input';
import {
  InputType,
  PartialType,
  IntersectionType,
  PickType,
} from '@nestjs/graphql';
import { News } from '../entities/news.entity';

@InputType()
export class UpdateNewsInput extends IntersectionType(
  PickType(News, ['id'], InputType),
  PartialType(CreateNewsInput),
) {}
