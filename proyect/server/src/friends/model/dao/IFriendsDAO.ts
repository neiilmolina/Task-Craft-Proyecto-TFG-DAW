import {
  FriendCreate,
  Friend,
  FriendReturn,
  FriendFilters,
} from "task-craft-models/src/model/friends/interfaces/interfacesFriends";

export default interface IFriendsDAO {
  getAll(filters: FriendFilters): Promise<Friend[]>;
  getById(idFriend: string): Promise<Friend | null>;
  create(
    idFriend: string,
    friendReq: FriendCreate
  ): Promise<FriendReturn | null>;
  update(idFriend: string): Promise<FriendReturn | null>;
  delete(idFriend: string): Promise<boolean>;
}
