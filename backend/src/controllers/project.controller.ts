import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import { createNewProject, getAllProjects, getProjectAnalytics, getSingleProject, updateProjectById } from '@/services/project.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { createProjectSchema, paginationSchema, projectIdSchema, updateProjectSchema } from '@/validation/project.validation';
import { workspaceIdSchema } from '@/validation/workspace.validation';

import { roleGuard } from '@/utils/role-guard';

class ProjectController {
    public createNewProject = asyncHandler(async (req: Request, res: Response) => {
        const body = createProjectSchema.parse(req.body);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

        const userId = req.user?._id;
        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.CREATE_PROJECT]);

        const { project } = await createNewProject(userId, workspaceId, body);

        res.status(HTTP_STATUS.CREATED).json({ message: 'Project created successfully', project });
    });

    public getAllProjects = asyncHandler(async (req: Request, res: Response) => {
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const paginationQuery = paginationSchema.parse(req.query);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { projects, pagination } = await getAllProjects(workspaceId, paginationQuery);

        res.status(HTTP_STATUS.OK).json({ message: 'Projects fetched successfully', projects, pagination });
    });

    public getSingleProject = asyncHandler(async (req: Request, res: Response) => {
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { project } = await getSingleProject(workspaceId, projectId);

        res.status(HTTP_STATUS.OK).json({ message: 'Project fetched successfully', project });
    });

    public getProjectAnalytics = asyncHandler(async (req: Request, res: Response) => {
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const userId = req.user?._id;

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.VIEW_ONLY]);

        const { analytics } = await getProjectAnalytics(workspaceId, projectId);

        res.status(HTTP_STATUS.OK).json({ message: 'Project analytics fetched successfully', analytics });
    });

    public updateProjectById = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?._id;
        const projectId = projectIdSchema.parse(req.params.projectId);
        const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
        const body = updateProjectSchema.parse(req.body);

        const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
        roleGuard(role, [Permissions.EDIT_PROJECT]);

        const { project } = await updateProjectById(workspaceId, projectId, body);

        res.status(HTTP_STATUS.OK).json({ message: 'Project updated successfully', project });
    });
}

export const projectController = new ProjectController();
