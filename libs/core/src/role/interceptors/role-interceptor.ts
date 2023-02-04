import { RoleService } from '@core/core/role/role.service';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RoleInterceptor implements NestInterceptor {
  constructor(private roleService: RoleService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request: Request = ctx.req;
    ctx.authenticateit_identity_ticket =
      request?.headers?.authenticateit_identity_ticket;

    if (!ctx.authenticateit_identity_ticket) {
      return next.handle();
    }

    ctx.user = await this.roleService.getsByAuthToken(
      ctx.authenticateit_identity_ticket,
    );

    return next.handle();
  }
}
