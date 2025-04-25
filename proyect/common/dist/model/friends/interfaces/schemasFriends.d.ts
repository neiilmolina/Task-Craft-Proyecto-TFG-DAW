import { FriendCreate, FriendFilters } from "./interfacesFriends";
export declare const validateFriendCreate: (input: Partial<FriendCreate>) => {
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
export declare const validateFriendFilters: (input: Partial<FriendFilters>) => {
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
