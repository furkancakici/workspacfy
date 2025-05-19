import connectDatabase from '@/config/database.config.ts';
import { RoleType } from '@/enums/role.enum.ts';
import RolePermissionModel from '@/models/role-permission.model.ts';
import { RolePermission } from '@/utils/role-permission.ts';
import mongoose from 'mongoose';

const seedRoles = async () => {
    await connectDatabase();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await RolePermissionModel.deleteMany({}, { session });

        for (const roleName in RolePermission) {
            const role = roleName as RoleType;
            const permissions = RolePermission[role];
            const newRole = new RolePermissionModel({
                name: role,
                permission: permissions,
            });
            await newRole.save({ session });
        }

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
        console.log('✅ Roles seeded');
    }
};

seedRoles();
