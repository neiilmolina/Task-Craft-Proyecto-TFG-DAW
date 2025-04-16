import {
  FriendCreate,
  Friend,
  FriendReturn,
  FriendFilters,
} from "@/src/friends/model/interfaces/interfacesFriends";

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
