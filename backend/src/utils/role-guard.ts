import { ErrorCodeEnum } from '@/enums/error-code.enum';
import { PermissionType, RoleType } from '@/enums/role.enum';

import { UnauthorizedException } from '@/utils/app-error';
import { RolePermission } from '@/utils/role-permission';

export const roleGuard = (role: RoleType, permissions: PermissionType[]) => {
    const rolePermissions = RolePermission[role];

    const hasPermission = permissions.every((permission) => rolePermissions.includes(permission));

    if (!hasPermission) {
        throw new UnauthorizedException('You are not authorized to access this resource', ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }
};
