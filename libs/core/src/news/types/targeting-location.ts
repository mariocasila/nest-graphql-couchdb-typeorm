import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType('TargetingLocation')
@InputType('TargetingLocationInput')
export class TargetingLocation {
  @Field(() => Boolean)
  @IsNotEmpty()
  active: boolean;

  @Field(() => [String])
  @IsNotEmpty()
  cities: string[];

  @Field(() => String)
  @IsNotEmpty()
  country: string;

  @Field(() => Number)
  @IsNotEmpty()
  distance: number;

  @Field(() => [String])
  @IsNotEmpty()
  postcodes: string[];

  @Field(() => [String])
  @IsNotEmpty()
  retailers: string[];

  @Field(() => [String])
  @IsNotEmpty()
  states: string[];
}
