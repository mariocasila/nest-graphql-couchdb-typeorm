import { AppModule } from '@app/app/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NewsModule } from './news.module';
import { NewsResolver } from './news.resolver';
import { NewsService } from './news.service';

describe('NewsResolver', () => {
  let app: INestApplication;
  let newsModule: NewsModule;
  let newsResolver: NewsResolver;
  let newsService: NewsService;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication(undefined, {
      logger: false,
    });

    await app.init();

    newsModule = app.get(NewsModule);
    newsResolver = app.select(NewsModule).get(NewsResolver);
    newsService = app.select(NewsModule).get(NewsService);

    await newsService.empty();
  });

  it('should be defined', () => {
    expect(newsModule).toBeDefined();
    expect(newsResolver).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
