import { z } from "zod";
import { FriendHasTasksCreate, FriendHasTasksFilters } from "./interfacesFriendsHasTasks";
export declare const validateFriendHasTasksCreate: (input: Partial<FriendHasTasksCreate>) => {
    success: boolean;
    input: {
        idAssignedUser: string;
        idTask: string;
        friendHasTaskRequestState: boolean;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
export declare const validateFriendHasTasksFilters: (input: Partial<FriendHasTasksFilters>) => {
    success: boolean;
    input: {
        idAssignedUser?: string | undefined;
        idTask?: string | undefined;
        friendHasTaskRequestState?: boolean | undefined;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
