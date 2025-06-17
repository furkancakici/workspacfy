import { Types } from 'mongoose';
import mongoose from 'mongoose';
import z from 'zod';

import MemberModel from '@/models/member.model';
import RolePermissionModel from '@/models/role-permission.model';
import TaskModel from '@/models/task.model';
import UserModel from '@/models/user.model';
import WorkspaceModel from '@/models/workspace.model';

import { Roles } from '@/enums/role.enum';
import { TaskStatusEnum } from '@/enums/task.enum';

import { createWorkspaceSchema } from '@/validation/workspace.validation';

import { NotFoundException } from '@/utils/app-error';

export const createNewWorkspace = async (userId: string, body: z.infer<typeof createWorkspaceSchema>) => {
    const { name, description } = body;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const user = await UserModel.findById(userId).session(session);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const ownerRole = await RolePermissionModel.findOne({ name: Roles.OWNER }).session(session);

        if (!ownerRole) {
            throw new NotFoundException('Owner role not found');
        }

        const workspace = new WorkspaceModel({ name, description, owner: user._id });
        await workspace.save({ session });

        const member = new MemberModel({
            workspaceId: workspace._id,
            userId: user._id,
            role: ownerRole._id,
        });
        await member.save({ session });

        user.currentWorkspace = workspace._id as Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();

        return workspace;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getAllWorkspaces = async (userId: string) => {
    const memberships = await MemberModel.find({ userId }).populate('workspaceId').select('-password').exec();

    const workspaces = memberships.map((membership) => membership.workspaceId);

    return workspaces;
};

export const getWorkspaceById = async (userId: string, workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const members = await MemberModel.find({ workspaceId }).populate('role');

    const workspaceWithMembers = {
        ...workspace.toObject(),
        members,
    };

    return { workspace: workspaceWithMembers };
};

export const getWorkspaceMembers = async (workspaceId: string) => {
    const members = await MemberModel.find({ workspaceId }).populate('userId', 'name email profilePicture').populate('role', 'name');

    const roles = await RolePermissionModel.find({}, { name: 1, _id: 1 }).select('-permission').lean();

    return { members, roles };
};

export const getWorkspaceAnalytics = async (workspaceId: string) => {
    const currentDate = new Date();

    const totalTasks = await TaskModel.countDocuments({ workspace: workspaceId });

    const overdueTasks = await TaskModel.countDocuments({
        workspace: workspaceId,
        dueDate: { $lt: currentDate },
        status: { $ne: TaskStatusEnum.DONE },
    });

    const completedTasks = await TaskModel.countDocuments({
        workspace: workspaceId,
        status: TaskStatusEnum.DONE,
    });

    const analytics = {
        totalTasks,
        overdueTasks,
        completedTasks,
    };

    return { analytics };
};

export const changeMemberRole = async (workspaceId: string, memberId: string, roleId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const role = await RolePermissionModel.findById(roleId);

    if (!role) {
        throw new NotFoundException('Role not found');
    }

    const member = await MemberModel.findOne({ userId: memberId, workspaceId: workspaceId });

    if (!member) {
        throw new NotFoundException('Member not found in the workspace');
    }

    member.role = role;
    await member.save();

    return { member };
};
