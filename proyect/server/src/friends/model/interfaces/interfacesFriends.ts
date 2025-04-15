export interface UserFriends {
  idUser: string;
  urlImg: string | null;
  userName: string;
  email: string;
}

export interface FriendBD {
  idAmigo: string;
  idUsuario: string;
  urlImagen: string | null;
  nombreUsuario: string;
  email: string;
  solicitudAmigoAceptada: boolean;
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
