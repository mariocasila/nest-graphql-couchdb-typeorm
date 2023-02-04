import { User } from '@core/core/news/interfaces/user';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RolesEnum } from '../enums/roles.enum';
import { Request } from 'express';
import { RoleService } from '../role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const request: Request = ctx.req;
    ctx.authenticateit_identity_ticket =
      request?.headers?.authenticateit_identity_ticket;

    if (!ctx.authenticateit_identity_ticket) {
      return false;
    }

    ctx.user = await this.roleService.getsByAuthToken(
      ctx.authenticateit_identity_ticket,
    );
    const user: User = ctx.user;
    if (!user) {
      return false;
    }
    const userRoles = user.roles;

    const roles = this.reflector.get<RolesEnum[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const matchedRole = roles.find((role) =>
      userRoles.find((userRole) => role === userRole),
    );
    if (!matchedRole) return false;

    return true;
  }
}
