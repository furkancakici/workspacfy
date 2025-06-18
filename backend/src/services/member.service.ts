import z from 'zod';

import MemberModel from '@/models/member.model';
import RolePermissionModel from '@/models/role-permission.model';
import WorkspaceModel from '@/models/workspace.model';

import { ErrorCodeEnum } from '@/enums/error-code.enum';
import { Roles } from '@/enums/role.enum';

import { inviteCodeSchema } from '@/validation/member.validation';

import { BadRequestException, NotFoundException, UnauthorizedException } from '@/utils/app-error';

export const getMemberRoleInWorkspace = async (userId: string, workspaceId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const member = await MemberModel.findOne({ userId, workspaceId }).populate('role');

    if (!member) {
        throw new UnauthorizedException('You are not a member of this workspace', ErrorCodeEnum.ACCESS_UNAUTHORIZED);
    }

    const roleName = member.role?.name;

    return { role: roleName };
};

export const getJoinWorkspaceByInvite = async (userId: string, body: z.infer<typeof inviteCodeSchema>) => {
    const { inviteCode } = body;

    const workspace = await WorkspaceModel.findOne({ inviteCode });

    if (!workspace) {
        throw new NotFoundException('Invalid invite code or workspace not found');
    }

    const existingMember = await MemberModel.findOne({ userId, workspaceId: workspace._id }).exec();

    if (existingMember) {
        throw new BadRequestException('You are already a member of this workspace');
    }

    const role = await RolePermissionModel.findOne({ name: Roles.MEMBER });

    if (!role) {
        throw new NotFoundException('Role not found');
    }

    const newMember = new MemberModel({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });

    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
};
