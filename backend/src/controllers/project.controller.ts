import { Request, Response } from 'express';

import { HTTP_STATUS } from '@/config/http.config';

import { Permissions } from '@/enums/role.enum';

import { getMemberRoleInWorkspace } from '@/services/member.service';
import { createNewProject, getAllProjects, getSingleProject } from '@/services/project.service';

import asyncHandler from '@/middlewares/async-handler.middleware';

import { createProjectSchema, paginationSchema, projectIdSchema } from '@/validation/project.validation';
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

        const { projects, pagination } = await getAllProjects(userId, workspaceId, paginationQuery);

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
}

export const projectController = new ProjectController();
