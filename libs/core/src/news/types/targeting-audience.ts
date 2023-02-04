import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType('TargetingAudience')
@InputType('TargetingAudienceInput')
export class TargetingAudience {
  @Field(() => String)
  @IsNotEmpty()
  gender: string;

  @Field(() => [String])
  @IsNotEmpty()
  user_levels: string[];
}
