import { Int, Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

@InputType()
export class PaginationArgs {
  @Field(() => Int)
  @IsOptional()
  @Transform((_) => +_.value)
  @IsNumber()
  page? = 0;

  @Field(() => Int)
  @IsOptional()
  @Transform((_) => +_.value)
  @IsNumber()
  pageSize? = 10;
}
