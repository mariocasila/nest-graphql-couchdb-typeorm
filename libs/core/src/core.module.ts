import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CoreService } from './core.service';
import { NewsModule } from './news/news.module';
import { NanoModule } from './nano/nano.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''
      }`,
      validationSchema: Joi.object({
        COUCH_DB_URL: Joi.string().required(),
        MYSQL_DB_URL: Joi.string().required(),
        SHPING_API_URL: Joi.string().required(),
        API_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        url: configService.get('MYSQL_DB_URL'),
        type: 'mysql',
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    NanoModule,
    NewsModule,
  ],
  providers: [CoreService],
  exports: [CoreService],
})
export class CoreModule {}
