import { AppModule } from '@app/app/app.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NewsModule } from './news.module';
import { NewsResolver } from './news.resolver';
import * as request from 'supertest';
import newsFixture from './seeds/fixtures';
import { NewsService } from './news.service';

describe('GraphQL NewsResolver (e2e) {supertest}', () => {
  let app: INestApplication;
  let newsModule: NewsModule;
  let newsResolver: NewsResolver;
  let newsService: NewsService;

  const authenticateit_identity_ticket = '3d1b7e70-8cf4-4a74-a22f-93fdb545e8a6';

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

  it('should create single news enitiy', async () => {
    const item = newsFixture[0];

    const query = `
      mutation {
        createNews(
          createNewsInput: {
            title: "${item.title}"
            body: "${item.body}"
            summary: "${item.summary}"
            audience: { 
              gender: "${item.audience?.gender}", 
              user_levels: [${item.audience?.user_levels
                .map((x) => `"${x}"`)
                .join(',')}]
            }
            locations: [
              ${item.locations
                ?.map(
                  (x) => `{
                active: ${x.active ? 'true' : 'false'},
                cities: [${x.cities?.map((y) => `"${y}"`).join(',')}],
                country: "${x.country}",
                distance: ${x.distance},
                postcodes: [${x.postcodes?.map((y) => `"${y}"`).join(',')}],
                retailers:  [${x.retailers?.map((y) => `"${y}"`).join(',')}],
                states: [${x.states?.map((y) => `"${y}"`).join(',')}],
              }`,
                )
                .join('')}
            ],
            link: "${item.link}"
            images: [
              ${item.images
                ?.map(
                  (x) => `{ 
                  size: [${x.size.map((y) => y).join(',')}], 
                  url: "${x.url}" 
                }`,
                )
                .join('')}
            ]
            type: "${item.type}"
            status: "${item.status}"
          }
        ) {
          id
          title
          body
          summary
          link
          images {
            size
            url
          }
          audience {
            gender
            user_levels
          }
          locations {
            active
            cities
            country
            distance
            postcodes
            retailers
            states
          }
          type
          status
        }
      }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query,
      })
      .set('authenticateit_identity_ticket', authenticateit_identity_ticket)
      .expect(200)
      .expect((res) => {
        const {
          data: { createNews: createdItem },
        } = res.body;

        item.id = createdItem.id;

        expect(createdItem).toEqual(item);
      });
  });

  it('should return one news entity', async () => {
    const item = newsFixture[0];

    const query = `
      query {
        news_one_by_id(id: "${item.id}") {
          id
          title
          body
          summary
          link
          images {
            size
            url
          }
          audience {
            gender
            user_levels
          }
          locations {
            active
            cities
            country
            distance
            postcodes
            retailers
            states
          }
          type
          status
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .set('authenticateit_identity_ticket', authenticateit_identity_ticket)
      .expect(200)
      .expect((res) => {
        const {
          data: { news_one_by_id: itemResult },
        } = res.body;

        expect(itemResult).toEqual(item);
      });
  });

  it('should return all news entities', async () => {
    const item = newsFixture[0];
    const query = `
      query {
        news(options: { page: 0, pageSize: 20 }) {
          data {
            id
            title
            body
            summary
            link
            images {
              size
              url
            }
            audience {
              gender
              user_levels
            }
            locations {
              active
              cities
              country
              distance
              postcodes
              retailers
              states
            }
            type
            status
          }
          total
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .set('authenticateit_identity_ticket', authenticateit_identity_ticket)
      .expect(200)
      .expect((res) => {
        const {
          data: {
            news: { data, total },
          },
        } = res.body;

        expect(total).toEqual(1);
        expect(data).toEqual([item]);
      });
  });

  it('it should update news entity', async () => {
    const item = newsFixture[0];
    item.body = 'body updated for testing';

    const query = `
      mutation {
        updateNews(
          updateNewsInput: { id: "${item.id}", body: "${item.body}" }
        ) {
          id
          title
          body
          summary
          link
          images {
            size
            url
          }
          audience {
            gender
            user_levels
          }
          locations {
            active
            cities
            country
            distance
            postcodes
            retailers
            states
          }
          type
          status
        }
      }
      `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .set('authenticateit_identity_ticket', authenticateit_identity_ticket)
      .expect(200)
      .expect((res) => {
        const {
          data: { updateNews },
        } = res.body;

        expect(updateNews).toEqual(item);
      });
  });

  it('it should delete news entity', async () => {
    const item = newsFixture[0];
    const query = `
      mutation {
        removeNews(id: "${item.id}") {
          id
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .set('authenticateit_identity_ticket', authenticateit_identity_ticket)
      .expect(200)
      .expect((res) => {
        const {
          data: { removeNews },
        } = res.body;

        expect(removeNews.id).toBe(item.id);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
