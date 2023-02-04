import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsUrl } from 'class-validator';

@ObjectType('NewsImage')
@InputType('NewsImageInput')
export class NewsImage {
  @Field(() => String)
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Field(() => [Number])
  @IsNotEmpty()
  size: number[];
}
