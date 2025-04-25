import { FriendHasTasksCreate, FriendHasTasksFilters } from "./interfacesFriendsHasTasks";
export declare const validateFriendHasTasksCreate: (input: Partial<FriendHasTasksCreate>) => {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
export declare const validateFriendHasTasksFilters: (input: Partial<FriendHasTasksFilters>) => {
    success: false;
    errors: {
        field: string;
        message: string;
        code: string;
    }[];
} | {
    success: true;
    data: any;
};
