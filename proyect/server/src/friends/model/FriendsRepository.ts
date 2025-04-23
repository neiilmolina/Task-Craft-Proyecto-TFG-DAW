import IFriendsDAO from "@/src/friends/model/dao/IFriendsDAO";
import {
  FriendCreate,
  FriendFilters,
} from "task-craft-models";
export default class FriendsRepository {
  constructor(private friendsDAO: IFriendsDAO) {}

  async getAll(filters: FriendFilters) {
    return this.friendsDAO.getAll(filters);
  }
  async getById(idFriend: string) {
    return this.friendsDAO.getById(idFriend);
  }
  async create(idFriend: string, friendReq: FriendCreate) {
    return this.friendsDAO.create(idFriend, friendReq);
  }
  async update(idFriend: string) {
    return this.friendsDAO.update(idFriend);
  }
  async delete(idFriend: string) {
    return this.friendsDAO.delete(idFriend);
  }
}
