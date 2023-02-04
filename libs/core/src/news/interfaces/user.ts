import { RolesEnum } from '@core/core/role/enums/roles.enum';

export interface User {
  id: string;
  roles: RolesEnum[];
}
