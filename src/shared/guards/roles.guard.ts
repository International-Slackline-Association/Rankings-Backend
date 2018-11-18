import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as express from 'express';
import { AuthenticationRole } from 'shared/enums';
import env_variables from 'shared/env_variables';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<AuthenticationRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<express.Request>();
    const isValid = this.validateAdminRole(request, roles);
    return isValid;
  }

  private validateAdminRole(
    request: express.Request,
    roles: AuthenticationRole[],
  ): boolean {
    if (roles.indexOf(AuthenticationRole.admin) > -1) {
      const adminRoleSecret = request.header('adminRoleSecret');
      return (
        adminRoleSecret && adminRoleSecret === env_variables.adminRoleSecret
      );
    }
    return true;
  }
}
