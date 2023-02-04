import { AppModule } from '@app/app/app.module';
import { INestApplicationContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NewsModule } from './news.module';
import { NewsService } from './news.service';

describe('NewsService', () => {
  let app: INestApplicationContext;
  let newsModule: NewsModule;
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
    newsService = app.select(NewsModule).get(NewsService);
  });

  it('should be defined', () => {
    expect(newsModule).toBeDefined();
    expect(newsService).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
