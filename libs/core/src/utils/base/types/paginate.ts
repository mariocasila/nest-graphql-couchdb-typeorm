import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPaginated<T> {
  data: T[];
  total: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginated<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginated<T> {
    @Field(() => [classRef], { nullable: true })
    data: T[];

    @Field(() => Int)
    total: number;
  }

  return PaginatedType as Type<IPaginated<T>>;
}
