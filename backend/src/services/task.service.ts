import mongoose, { FilterQuery } from 'mongoose';

import MemberModel from '@/models/member.model';
import ProjectModel from '@/models/project.model';
import TaskModel, { TaskDocument } from '@/models/task.model';
import WorkspaceModel from '@/models/workspace.model';

import { TaskPriorityEnum, TaskStatusEnum } from '@/enums/task.enum';

import { CreateTaskType, GetTasksQueryType, UpdateTaskType } from '@/validation/task.validation';

import { BadRequestException, NotFoundException } from '@/utils/app-error';

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

export const updateTaskById = async (taskId: string, workspaceId: string, projectId: string, body: UpdateTaskType) => {
    const project = await ProjectModel.findById(projectId);

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    const task = await TaskModel.findById(taskId);

    if (!task || !task.workspace.equals(workspaceId) || !task.project.equals(projectId)) {
        throw new NotFoundException('Task not found or does not belong to the workspace');
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { ...body }, { new: true });

    if (!updatedTask) {
        throw new BadRequestException('Failed to update task');
    }

    return { updatedTask };
};

export const getAllTasks = async (workspaceId: string, query: GetTasksQueryType) => {
    const { projectId, status, priority, assignedTo, keyword, dueDate, pageSize, page } = query;

    const filterQuery: FilterQuery<TaskDocument> = { workspace: workspaceId };

    if (projectId) {
        filterQuery.project = projectId;
    }

    if (status && status.length > 0) {
        filterQuery.status = { $in: status };
    }

    if (priority && priority.length > 0) {
        filterQuery.priority = { $in: priority };
    }

    if (assignedTo && assignedTo.length > 0) {
        filterQuery.assignedTo = { $in: assignedTo };
    }

    if (keyword && keyword != undefined) {
        filterQuery.title = { $regex: keyword, $options: 'i' };
    }

    if (dueDate) {
        filterQuery.dueDate = { $eq: new Date(dueDate) };
    }

    const [tasks, totalCount] = await Promise.all([
        TaskModel.find(filterQuery)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate('project')
            .populate('assignedTo', '_id name profilePicture -password')
            .populate('project', '_id emoji name')
            .lean(),
        TaskModel.countDocuments(filterQuery),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return { tasks, pagination: { currentPage: page, pageSize, totalCount, totalPages, hasNextPage, hasPrevPage } };
};

export const getTaskById = async (taskId: string, workspaceId: string, projectId: string) => {
    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
        throw new NotFoundException('Workspace not found');
    }

    const project = await ProjectModel.findById(projectId);

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    const task = await TaskModel.findOne({ _id: taskId, workspace: workspaceId, project: projectId }).populate('assignedTo', '_id name profilePicture -password').lean();

    if (!task) {
        throw new NotFoundException('Task not found or does not belong to the workspace or project');
    }

    return { task };
};

export const deleteTaskById = async (taskId: string, workspaceId: string, projectId: string) => {
    const project = await ProjectModel.findById(projectId);

    if (!project || !project.workspace.equals(workspaceId)) {
        throw new NotFoundException('Project not found or does not belong to the workspace');
    }

    const task = await TaskModel.findOne({ _id: taskId, workspace: workspaceId, project: projectId });

    if (!task) {
        throw new NotFoundException('Task not found or does not belong to the workspace or project');
    }

    await task.deleteOne();

    return { task };
};
