import { BaseCouchModel } from '@core/core/utils/base/couch-model/base-couch-model';
import * as Nano from 'nano';
import { News } from '../entities/news.entity';
import { NewsImage } from '../types/news-image';
import { TargetingAudience } from '../types/targeting-audience';
import { TargetingLocation } from '../types/targeting-location';

interface iNews extends Nano.MaybeDocument {
  title: string;

  summary?: string;

  body: string;

  link?: string;

  images?: NewsImage[];

  audience: TargetingAudience;

  locations: TargetingLocation[];

  userId: string;

  type: string;
  status: string;
}

export class NewsCouchModel extends BaseCouchModel implements iNews {
  constructor({
    id,
    title,
    summary,
    body,
    link,
    images,
    audience,
    locations,
    userId,
    type,
    status,
  }: News) {
    super();

    this._id = id;
    this.title = title;
    this.summary = summary;
    this.body = body;
    this.link = link;
    this.images = images;
    this.audience = audience;
    this.locations = locations;
    this.userId = userId;
    this.type = type;
    this.status = status;
  }

  title: string;
  summary?: string;
  body: string;
  link?: string;
  images?: NewsImage[];
  audience: TargetingAudience;
  locations: TargetingLocation[];
  userId: string;
  type: string;
  status: string;
}
