import IFriendsHasTasksDAO from "@/src/friends_has_tasks/model/dao/IFriendsHasTasksDAO";
import {
  FriendHasTasks,
  FriendHasTasksCreate,
  FriendHasTasksFilters,
  FriendHasTasksReturn,
} from "task-craft-models";

export default class FriendsHasTasksRepository {
  constructor(private friendsHasTasksDAO: IFriendsHasTasksDAO) {}

  async getAll(filters: FriendHasTasksFilters): Promise<FriendHasTasks[]> {
    return this.friendsHasTasksDAO.getAll(filters);
  }
  async getById(idFriendHasTask: string): Promise<FriendHasTasks | null> {
    return this.friendsHasTasksDAO.getById(idFriendHasTask);
  }
  async create(
    idFriendHasTask: string,
    shareTaskReq: FriendHasTasksCreate
  ): Promise<FriendHasTasksReturn | null> {
    return this.friendsHasTasksDAO.create(idFriendHasTask, shareTaskReq);
  }
  async update(idFriendHasTask: string): Promise<FriendHasTasksReturn | null> {
    return this.friendsHasTasksDAO.update(idFriendHasTask);
  }
  async delete(idFriendHasTask: string): Promise<boolean> {
    return this.friendsHasTasksDAO.delete(idFriendHasTask);
  }
}
