import { PaginationArgs } from '@core/core/utils/base/args/pagination-args';
import { InputType } from '@nestjs/graphql';

@InputType()
export class FindNewsArgs extends PaginationArgs {
  id?: string;
  userId?: string;
}
