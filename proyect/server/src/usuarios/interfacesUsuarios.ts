import { Rol } from "@/src/roles/interfacesRoles";

export interface Usuario {
  idUsuario: string;
  nombreUsuario: string;
  email: string;
  urlImg: string;
  rol: Rol;
}

export interface UsuarioCreate {
  idUsuario: string;
  nombreUsuario?: string;
  email: string;
  password: string;
  urlImg?: string;
  idRol?: number;
}

export interface UsuarioUpdate {
  nombreUsuario: string;
  email?: string;
  password?: string;
  urlImg?: string;
  idRol?: number;
}

export interface UsuarioReturn {
  idUsuario: string;
  nombreUsuario?: string;
  email: string;
  urlImg?: string;
  idRol: number;
}
