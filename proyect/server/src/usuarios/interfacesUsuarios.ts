import { Rol } from "@/src/roles/interfacesRoles";

export interface UsuarioBD {
  idUsuario: string;
  nombreUsuario: string;
  email: string;
  password: string; // Incluimos el campo password ya que estaba en el objeto
  urlImagen: string | null; // Se permite null para la URL de la imagen
  idRol: number; // Asumiendo que el idRol es un número
  rol?: string;
}

export interface Usuario {
  idUsuario: string;
  nombreUsuario: string;
  email: string;
  urlImg: string | null;
  rol: Rol;
}

export interface UsuarioCreate {
  nombreUsuario?: string;
  email: string;
  password: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UsuarioUpdate {
  nombreUsuario: string;
  email?: string;
  urlImg?: string | null;
  idRol?: number;
}

export interface UsuarioReturn {
  idUsuario: string;
  nombreUsuario?: string;
  email: string;
  urlImg?: string | null;
  idRol: number;
}
