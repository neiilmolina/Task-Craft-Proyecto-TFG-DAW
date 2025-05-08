import { z } from "zod";
import { FriendCreate, FriendFilters } from "./interfacesFriends";
export declare const validateFriendCreate: (input: Partial<FriendCreate>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
export declare const validateFriendFilters: (input: Partial<FriendFilters>) => import("../../../validations/formatMessages").FormatZodResult<z.ZodType<any, z.ZodTypeDef, any>>;
