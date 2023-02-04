import { News } from '../../entities/news.entity';

const newsMinimanFixture: News[] = [
  {
    id: '53eafcc5-43f8-4e79-add8-8f84ec8bb08e',
    title: 'New product from Bega',
    body: 'Long text description (optional)',
    summary: 'Short text description',
    link: 'https://apple.com',
    images: [
      {
        size: [300, 100],
        url: 'https://cdn.shping.com/2022/11/18/0983baf5-c9bf-44c3-a007-949a7f41443c',
      },
    ],
    audience: {
      gender: 'female',
      user_levels: ['gold', 'ambassador', 'silver'],
    },
    locations: [
      {
        active: true,
        cities: ['Melbourne'],
        country: '036',
        distance: 37,
        postcodes: ['3004', '3000'],
        retailers: [
          'urn:authenticateit:participant:111111111111111',
          'urn:authenticateit:participant:111111111111115',
        ],
        states: ['VIC'],
      },
    ],
    type: 'content',
    status: 'draft',
  },
];

export default newsMinimanFixture;
