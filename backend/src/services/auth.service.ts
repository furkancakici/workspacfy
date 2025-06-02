import mongoose, { Types } from 'mongoose';

import AccountModel from '@/models/account.model';
import MemberModel from '@/models/member.model';
import RolePermissionModel from '@/models/role-permission.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';

import { Roles } from '@/enums/role.enum';

import { NotFoundException } from '@/utils/app-error';

type LoginOrCreateAccountServiceData = {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
};

export const loginOrCreateAccountService = async (data: LoginOrCreateAccountServiceData) => {
    const { provider, displayName, providerId, picture, email } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        let user = await UserModel.findOne({ email }).session(session);

        if (!user) {
            user = await UserModel.create({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            const account = await AccountModel.create({
                provider,
                providerId,
                userId: user._id,
            });
            await account.save({ session });

            const workspace = await WorkspaceModel.create({
                name: 'My Workspace',
                description: `Workspace created by ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            const ownerRole = await RolePermissionModel.findOne({ name: Roles.OWNER }).session(session);

            if (!ownerRole) {
                throw new NotFoundException('Owner role not found');
            }

            const member = await MemberModel.create({
                workspaceId: workspace._id,
                userId: user._id,
                role: ownerRole._id,
            });
            await member.save({ session });

            user.currentWorkspace = workspace._id as Types.ObjectId;
            await user.save({ session });

            return user;
        }

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
