import z from 'zod';

export const inviteCodeSchema = z.object({
    inviteCode: z.string().trim().min(1, { message: 'Invite code is required' }),
});
