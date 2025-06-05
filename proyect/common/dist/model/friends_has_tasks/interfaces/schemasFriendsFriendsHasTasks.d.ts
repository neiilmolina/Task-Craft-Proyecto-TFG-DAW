import { z } from "zod";
import { FriendHasTasksCreate, FriendHasTasksFilters } from "./interfacesFriendsHasTasks";
export declare const validateFriendHasTasksCreate: (input: Partial<FriendHasTasksCreate>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare const validateFriendHasTasksFilters: (input: Partial<FriendHasTasksFilters>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
