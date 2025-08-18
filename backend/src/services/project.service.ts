import ProjectModel from '@/models/project.model';
import WorkspaceModel from '@/models/workspace.model';

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
