import { Rol } from "@/src/roles/interfacesRoles";

export interface UserBD {
  idUser: string;
  userName: string;
  email: string;
  password: string;
  urlImg: string | null;
  idRol: number;
  rol?: string;
}

export interface User {
  idUser: string;
  userName: string;
  email: string;
  urlImg: string | null;
  rol: Rol;
}

export interface UserCreate {
  userName?: string;
  email: string;
  password: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UserUpdate {
  userName: string;
  email?: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UserReturn {
  idUser: string;
  userName?: string;
  email: string;
  urlImg?: string | null;
  idRol: number;
}
