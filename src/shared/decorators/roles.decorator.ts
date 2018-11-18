import { ReflectMetadata } from '@nestjs/common';
import { AuthenticationRole } from 'shared/enums';

export const Roles = (...roles: AuthenticationRole[]) => ReflectMetadata('roles', roles);
