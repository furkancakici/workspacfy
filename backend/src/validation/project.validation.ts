import { z } from 'zod';

export const emojiSchema = z.string().trim().optional();
export const nameSchema = z.string().trim().optional();
export const descriptionSchema = z.string().trim().optional();

export const createProjectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    emoji: emojiSchema,
});

export const updateProjectSchema = z.object({
    name: nameSchema,
    description: descriptionSchema,
    emoji: emojiSchema,
});

export const paginationSchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, { message: 'Page number must be greater than 0' }),
    pageSize: z
        .string()
        .optional()
        .default('10')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val <= 100, { message: 'Page size must be between 1 and 100' }),
});

export const projectIdSchema = z.string().trim().min(1, { message: 'Project ID is required' });

export type ProjectType = z.infer<typeof createProjectSchema>;
export type PaginationType = z.infer<typeof paginationSchema>;
