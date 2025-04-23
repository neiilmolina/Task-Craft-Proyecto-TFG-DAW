"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFriendFilters = exports.validateFriendCreate = void 0;
const zod_1 = require("zod");
const uuid = zod_1.z.string().uuid();
const request = zod_1.z.boolean().default(false);
const friendCreateSchema = zod_1.z.object({
    firstUser: uuid,
    secondUser: uuid,
    friendRequestState: request,
});
const friendFiltersSchema = zod_1.z.object({
    idFirstUser: uuid.optional(),
    idSecondUser: uuid.optional(),
    friendRequestState: zod_1.z
        .preprocess((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return val;
    }, zod_1.z.boolean())
        .optional(),
});
const validateFriendCreate = (input) => {
    const result = friendCreateSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateFriendCreate = validateFriendCreate;
const validateFriendFilters = (input) => {
    const result = friendFiltersSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateFriendFilters = validateFriendFilters;
