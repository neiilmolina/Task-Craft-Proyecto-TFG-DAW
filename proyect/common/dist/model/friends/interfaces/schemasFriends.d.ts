import { z } from "zod";
import { FriendCreate, FriendFilters } from "./interfacesFriends";
export declare const validateFriendCreate: (input: Partial<FriendCreate>) => {
    success: boolean;
    input: {
        firstUser: string;
        secondUser: string;
        friendRequestState: boolean;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
export declare const validateFriendFilters: (input: Partial<FriendFilters>) => {
    success: boolean;
    input: {
        friendRequestState?: boolean | undefined;
        idFirstUser?: string | undefined;
        idSecondUser?: string | undefined;
    };
    errors?: undefined;
} | {
    success: boolean;
    errors: z.ZodIssue[];
    input?: undefined;
};
