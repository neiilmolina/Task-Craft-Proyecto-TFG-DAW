import { Role } from "../../../model/roles/interfaces/interfacesRoles";
export interface UserBD {
    idUser: string;
    userName: string;
    email: string;
    password: string;
    urlImg: string | null;
    idRol: number;
    role?: string;
}
export interface UserFriends {
    idUser: string;
    urlImg: string | null;
    userName: string | null;
    email: string;
}
export interface User {
    idUser: string;
    userName: string | null;
    email: string;
    urlImg: string | null;
    role: Role;
}
export interface UserCreate {
    userName?: string | null;
    email: string;
    password: string;
    urlImg?: string | null;
    idRole?: number;
}
export interface UserUpdate {
    userName?: string | null;
    email?: string;
    urlImg?: string | null;
    idRole?: number;
}
export interface UserReturn {
    idUser: string;
    userName?: string | null;
    email: string;
    urlImg?: string | null;
    idRole: number;
}
export interface UserToken extends User {
    iat: number;
    exp: number;
}
