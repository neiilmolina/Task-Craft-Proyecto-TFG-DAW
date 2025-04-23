import { UserFriends } from "../../users/interfaces/interfacesUsers";

export interface FriendBD {
  idFriend: string;

  idUser1: string;
  urlImg1: string | null;
  userName1: string;
  email1: string;

  idUser2: string;
  urlImg2: string | null;
  userName2: string;
  email2: string;

  friendRequestState: boolean;
}

export interface FriendHasTasksFilters {
  idFirstUser?: string;
  idSecondUser?: string;
  idType?: number;
  idState?: number;
  friendRequestState?: boolean;
}

export interface Friend {
  idFriend: string;
  firstUser: UserFriends;
  secondUser: UserFriends;
  friendRequestState: boolean;
}

export interface FriendCreate {
  firstUser: string;
  secondUser: string;
  friendRequestState: false;
}

export interface FriendReturn {
  idFriend: string;
  firstUser: string;
  secondUser: string;
  friendRequestState: boolean;
}
