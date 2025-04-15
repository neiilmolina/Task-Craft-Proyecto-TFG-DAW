import {
  FriendCreate,
  Friend,
  FriendReturn,
} from "@/src/friends/model/interfaces/interfacesFriends";

export default interface IFriendsDAO {
  getAll(idFirstUser?: string, idSecondUser?: string): Promise<Friend[]>;
  getById(idFriend: string): Promise<Friend | null>;
  create(
    idFriend: string,
    friendReq: FriendCreate
  ): Promise<FriendReturn | null>;
  update(
    idFriend: string
  ): Promise<FriendReturn | null>;
  delete(idFriend: string): Promise<boolean>;
}
