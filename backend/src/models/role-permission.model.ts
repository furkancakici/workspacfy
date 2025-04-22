import { Permissions, PermissionType, Roles, RoleType } from '@/enums/role.enum.ts';
import { RolePermission } from '@/utils/role-permission.ts';
import mongoose, { Document, Schema } from 'mongoose';

export interface RolePermissionDocument extends Document {
    name: RoleType;
    permission: Array<PermissionType>;
}

const rolePermissionSchema = new Schema<RolePermissionDocument>(
    {
        name: { type: String, enum: Object.values(Roles), required: true, trim: true },
        permission: {
            type: [String],
            enum: Object.values(Permissions),
            required: true,
            default: function (this: RolePermissionDocument) {
                const role = RolePermission[this.name];
                return role;
            },
        },
    },
    { timestamps: true }
);

const RolePermissionModel = mongoose.model<RolePermissionDocument>('RolePermission', rolePermissionSchema);
export default RolePermissionModel;
