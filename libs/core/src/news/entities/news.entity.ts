import { ObjectType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { NewsImage } from '../types/news-image';
import { TargetingAudience } from '../types/targeting-audience';
import { TargetingLocation } from '../types/targeting-location';

@ObjectType()
@Entity()
export class News {
  @Field(() => String, { description: 'ID' })
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Field(() => String)
  @Column()
  @IsNotEmpty()
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsOptional()
  summary?: string;

  @Field(() => String)
  @Column()
  @IsNotEmpty()
  body: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  link?: string;

  @Field(() => [NewsImage], { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  @ValidateNested({ each: true })
  @Type(() => NewsImage)
  images?: NewsImage[];

  @Field(() => TargetingAudience, { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  @IsOptional()
  @ValidateNested({})
  @Type(() => TargetingAudience)
  audience?: TargetingAudience;

  @Field(() => [TargetingLocation], { nullable: true })
  @Column({ type: 'simple-json', nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TargetingLocation)
  locations?: TargetingLocation[];

  @Column()
  userId?: string;

  @Field(() => String)
  @IsNotEmpty()
  @Column()
  type: string;

  @Field(() => String)
  @IsNotEmpty()
  @Column()
  status: string;
}
