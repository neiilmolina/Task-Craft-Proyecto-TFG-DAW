"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFriendHasTasksFilters = exports.validateFriendHasTasksCreate = void 0;
const zod_1 = require("zod");
const uuid = zod_1.z.string().uuid();
const request = zod_1.z.boolean().default(false);
const friendCreateSchema = zod_1.z.object({
    idAssignedUser: uuid,
    idTask: uuid,
    friendHasTaskRequestState: request,
});
const friendFiltersSchema = zod_1.z.object({
    idAssignedUser: uuid.optional(),
    idTask: uuid.optional(),
    friendHasTaskRequestState: zod_1.z
        .preprocess((val) => {
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        return val;
    }, zod_1.z.boolean())
        .optional(),
});
const validateFriendHasTasksCreate = (input) => {
    const result = friendCreateSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateFriendHasTasksCreate = validateFriendHasTasksCreate;
const validateFriendHasTasksFilters = (input) => {
    const result = friendFiltersSchema.safeParse(input);
    if (result.success) {
        return { success: true, input: result.data };
    }
    else {
        return { success: false, errors: result.error.errors };
    }
};
exports.validateFriendHasTasksFilters = validateFriendHasTasksFilters;
