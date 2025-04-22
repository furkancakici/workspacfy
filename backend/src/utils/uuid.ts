import { v4 as uuidv4 } from 'uuid';

export const generateInviteCode = (): string => {
    const code = uuidv4().replace(/-/g, '').substring(0, 8);
    return code;
};

export const generateTaskCode = (): string => {
    const code = `task-${uuidv4().replace(/-/g, '').substring(0, 8)}`;
    return code;
};
