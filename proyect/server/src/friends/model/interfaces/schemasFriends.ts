import { z } from "zod";
import {
  FriendCreate,
  FriendFilters,
} from "task-craft-models/src/model/friends/interfaces/interfacesFriends";

const uuid = z.string().uuid();

const request = z.boolean().default(false);

const friendCreateSchema = z.object({
  firstUser: uuid,
  secondUser: uuid,
  friendRequestState: request,
});

const friendFiltersSchema = z.object({
  idFirstUser: uuid.optional(),
  idSecondUser: uuid.optional(),
  friendRequestState: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const validateFriendCreate = (input: Partial<FriendCreate>) => {
  const result = friendCreateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};

export const validateFriendFilters = (input: Partial<FriendFilters>) => {
  const result = friendFiltersSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
