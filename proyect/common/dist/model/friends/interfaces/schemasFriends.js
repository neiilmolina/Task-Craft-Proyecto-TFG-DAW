"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFriendFilters = exports.validateFriendCreate = void 0;
const zod_1 = require("zod");
const formatMessages_1 = require("../../../validations/formatMessages");
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
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateFriendCreate = validateFriendCreate;
const validateFriendFilters = (input) => {
    const result = friendFiltersSchema.safeParse(input);
    return (0, formatMessages_1.formatZodMessages)(result);
};
exports.validateFriendFilters = validateFriendFilters;
