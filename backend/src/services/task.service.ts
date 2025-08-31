import mongoose from 'mongoose';

import MemberModel from '@/models/member.model';
import ProjectModel from '@/models/project.model';
import TaskModel from '@/models/task.model';

import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task.enum';

import { CreateTaskType } from '@/validation/task.validation';

import { NotFoundException } from '@/utils/app-error';

export const createNewTask = async (userId: string, workspaceId: string, projectId: string, body: CreateTaskType) => {
    const { title, description, priority, status, assignedTo, dueDate } = body;

    const project = await ProjectModel.findById(projectId);

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    if (assignedTo) {
        const isAssignedUserMember = await MemberModel.exists({ userId: assignedTo, workspaceId });

        if (!isAssignedUserMember) {
            throw new NotFoundException('Assigned user is not a member of the workspace');
        }
    }

    const task = new TaskModel({
        title,
        description,
        priority: priority || TaskPriorityEnum.MEDIUM,
        status: status || TaskStatusEnum.TODO,
        assignedTo,
        createdBy: userId,
        workspace: workspaceId,
        project: projectId,
        dueDate,
    });

    await task.save();

    return { task };
};
