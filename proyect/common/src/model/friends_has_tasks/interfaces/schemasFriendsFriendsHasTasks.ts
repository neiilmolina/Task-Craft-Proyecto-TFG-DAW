import { z } from "zod";
import {
  FriendHasTasksCreate,
  FriendHasTasksFilters,
} from "./interfacesFriendsHasTasks";
import { formatZodMessages } from "../../../validations/formatMessages";

const uuid = z.string().uuid();

const request = z.boolean().default(false);

const friendCreateSchema = z.object({
  idAssignedUser: uuid,
  idTask: uuid,
  friendHasTaskRequestState: request,
});

const friendFiltersSchema = z.object({
  idCreatorUser: uuid.optional(),
  idAssignedUser: uuid.optional(),
  friendHasTaskRequestState: z
    .preprocess((val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    }, z.boolean())
    .optional(),
});
export const validateFriendHasTasksCreate = (
  input: Partial<FriendHasTasksCreate>
) => {
  const result = friendCreateSchema.safeParse(input);
  return formatZodMessages(result);
};

export const validateFriendHasTasksFilters = (
  input: Partial<FriendHasTasksFilters>
) => {
  const result = friendFiltersSchema.safeParse(input);
  return formatZodMessages(result);
};
