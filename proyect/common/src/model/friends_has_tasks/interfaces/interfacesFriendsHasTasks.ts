import { Task } from "../../tasks";
import { UserFriends } from "../../users/interfaces/interfacesUsers";
export interface FriendHasTasksBD {
  idFriendHasTask: string;
  friendHasTaskRequestState: boolean;

  // Datos del creador de la tarea
  idUserCreator: string;
  userNameCreator: string;
  emailCreator: string;
  urlImgCreator: string | null;

  // Datos del amigo asignado
  idUserAssigned: string;
  userNameAssigned: string;
  emailAssigned: string;
  urlImgAssigned: string | null;

  // Datos de la tarea
  idTask: string;
  title: string;
  description: string;
  activityDate: string;

  // Estado
  idState: number;
  state: string;

  // Tipo
  idType: number;
  type: string;
  color: string;
}

export interface FriendHasTasksFilters {
  idCreatorUser?: string;
  idAssignedUser?: string;
  friendHasTaskRequestState?: boolean;
}

export interface FriendHasTasks {
  idFriendHasTasks: string;
  creatorUser: UserFriends;
  assignedUser: UserFriends;
  friendHasTaskRequestState: boolean;
  task: Task;
}

export interface FriendHasTasksCreate {
  idAssignedUser: string;
  idTask: string;
  friendHasTaskRequestState: false;
}

export interface FriendHasTasksReturn {
  idFriendHasTasks: string;
  idAssignedUser: string;
  idTask: string;
  friendHasTaskRequestState: boolean;
}
