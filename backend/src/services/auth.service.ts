import mongoose, { Types } from 'mongoose';

import AccountModel from '@/models/account.model';
import MemberModel from '@/models/member.model';
import RolePermissionModel from '@/models/role-permission.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';

import { ProviderEnum } from '@/enums/account-provider.enum';
import { Roles } from '@/enums/role.enum';

import { BadRequestException, NotFoundException } from '@/utils/app-error';

type LoginOrCreateAccountServiceData = {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email?: string;
};

export const loginOrCreateAccountService = async (body: LoginOrCreateAccountServiceData) => {
    const { provider, displayName, providerId, picture, email } = body;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        let user = await UserModel.findOne({ email }).session(session);

        if (!user) {
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            });
            await user.save({ session });

            const account = new AccountModel({
                provider,
                providerId,
                userId: user._id,
            });
            await account.save({ session });

            const workspace = new WorkspaceModel({
                name: 'My Workspace',
                description: `Workspace created by ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            const ownerRole = await RolePermissionModel.findOne({ name: Roles.OWNER }).session(session);

            if (!ownerRole) {
                throw new NotFoundException('Owner role not found');
            }

            const member = new MemberModel({
                workspaceId: workspace._id,
                userId: user._id,
                role: ownerRole._id,
            });
            await member.save({ session });

            user.currentWorkspace = workspace._id as Types.ObjectId;
            await user.save({ session });
        }

        await session.commitTransaction();

        return user;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const registerUserService = async (body: { email: string; name: string; password: string }) => {
    const { name, email, password } = body;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const existingUser = await UserModel.findOne({ email }).session(session);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const user = new UserModel({ name, email, password });

        await user.save({ session });

        const account = new AccountModel({
            provider: ProviderEnum.EMAIL,
            providerId: email,
            userId: user._id,
        });
        await account.save({ session });

        const workspace = new WorkspaceModel({
            name: 'My Workspace',
            description: `Workspace created by ${user.name}`,
            owner: user._id,
        });
        await workspace.save({ session });

        const ownerRole = await RolePermissionModel.findOne({ name: Roles.OWNER }).session(session);

        if (!ownerRole) {
            throw new NotFoundException('Owner role not found');
        }

        const member = new MemberModel({
            workspaceId: workspace._id,
            userId: user._id,
            role: ownerRole._id,
        });
        await member.save({ session });

        user.currentWorkspace = workspace._id as Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();

        return { userId: user._id, workspaceId: workspace._id };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
