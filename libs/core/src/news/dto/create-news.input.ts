import { InputType, OmitType } from '@nestjs/graphql';
import { News } from '../entities/news.entity';

@InputType()
export class CreateNewsInput extends OmitType(News, ['id'], InputType) {}
