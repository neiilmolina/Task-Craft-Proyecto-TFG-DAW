import { z } from "zod";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
} from "./interfacesFriendsHasTasks";

const uuid = z.string().uuid();

const request = z.boolean().default(false);

const friendCreateSchema = z.object({
  idAssignedUser: uuid,
  idTask: uuid,
  friendHasTaskRequestState: request,
});

const friendFiltersSchema = z.object({
  idAssignedUser: uuid.optional(),
  idTask: uuid.optional(),
  friendHasTaskRequestState: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const validateFriendHasTasksCreate = (input: Partial<FriendHasTasksCreate>) => {
  const result = friendCreateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};

export const validateFriendHasTasksFilters = (input: Partial<FriendHasTasksFilters>) => {
  const result = friendFiltersSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
