import { z } from "zod";
import { FriendCreate } from "@/src/friends/model/interfaces/interfacesFriends";
import { UUID_REGEX } from "@/src/core/constants";

const idUser = z.string().refine((val) => UUID_REGEX.test(val), {
  message: "El ID del usuario debe ser un UUID válido",
});

const request = z.boolean().default(false);

export const FriendCreateSchema = z.object({
  firstFriend: idUser,
  secondFriend: idUser,
  friendRequestState: request,
});

export const validateFriendCreate = (input: Partial<FriendCreate>) => {
  const result = FriendCreateSchema.safeParse(input);
  if (result.success) {
    return { success: true, input: result.data };
  } else {
    return { success: false, errors: result.error.errors };
  }
};
