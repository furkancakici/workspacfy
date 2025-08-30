import mongoose from 'mongoose';

import ProjectModel from '@/models/project.model';
import TaskModel from '@/models/task.model';
import WorkspaceModel from '@/models/workspace.model';

import { TaskStatusEnum } from '@/enums/task.enum';

import { PaginationType, ProjectType } from '@/validation/project.validation';

import { NotFoundException } from '@/utils/app-error';

export const createNewProject = async (userId: string, workspaceId: string, body: ProjectType) => {
    const project = new ProjectModel({
        ...(body.emoji && { emoji: body.emoji }),
        name: body.name,
        description: body.description,
        workspace: workspaceId,
        createdBy: userId,
    });

    await project.save();

    return { project };
};

export const getAllProjects = async (workspaceId: string, pagination: PaginationType) => {
    const { page, pageSize } = pagination;
    const skip = (page - 1) * pageSize;

    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const totalCount = await ProjectModel.countDocuments({ workspace: workspace._id });

    const projects = await ProjectModel.find({ workspace: workspace._id }).populate('createdBy', 'name email').sort({ createdAt: -1 }).skip(skip).limit(pageSize).exec();

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return { projects, pagination: { currentPage: page, pageSize, totalCount, totalPages, hasNextPage, hasPrevPage } };
};

export const getSingleProject = async (workspaceId: string, projectId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspace._id }).select('name description emoji');

    if (!project) {
        throw new NotFoundException('Project not found');
    }

    return { project };
};

export const getProjectAnalytics = async (workspaceId: string, projectId: string) => {
    const project = await ProjectModel.findById(projectId);

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    const currentDate = new Date();

    const taskAnalytics = await TaskModel.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId),
            },
        },
        {
            $facet: {
                totalTasks: [{ $count: 'count' }],
                overdueTasks: [{ $match: { dueDate: { $lt: currentDate }, status: { $ne: TaskStatusEnum.DONE } } }, { $count: 'count' }],
                completedTasks: [{ $match: { status: TaskStatusEnum.DONE } }, { $count: 'count' }],
            },
        },
    ]);

    const _analytics = taskAnalytics[0];

    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overdueTasks: _analytics.overdueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTasks[0]?.count || 0,
    };

    return { analytics };
};

export const updateProjectById = async (workspaceId: string, projectId: string, body: ProjectType) => {
    const project = await ProjectModel.findOne({ _id: projectId, workspace: workspaceId });

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    project.name = body.name || project.name;
    project.description = body.description || project.description;
    project.emoji = body.emoji || project.emoji;
    await project.save();

    return { project };
};
