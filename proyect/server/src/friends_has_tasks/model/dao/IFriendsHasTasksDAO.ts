import {
  FriendHasTasks,
  FriendHasTasksFilters,
  FriendHasTasksCreate,
  FriendHasTasksReturn,
} from "task-craft-models";

export default interface IFriendsHasTasksDAO {
  getAll(filters: FriendHasTasksFilters): Promise<FriendHasTasks[]>;
  getById(idFriendHasTask: string): Promise<FriendHasTasks | null>;
  create(
    idFriendHasTask: string,
    shareTaskReq: FriendHasTasksCreate
  ): Promise<FriendHasTasksReturn | null>;
  update(idFriendHasTask: string): Promise<FriendHasTasksReturn | null>;
  delete(idFriendHasTask: string): Promise<boolean>;
}
