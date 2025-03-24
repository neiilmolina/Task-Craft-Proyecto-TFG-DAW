import { User } from "@supabase/supabase-js";

export interface Tipo {
  idTipo: number;
  tipo: string;
  color: string;
  idUsuario: string;
  userDetails?: User;
}

export interface TipoCreate {
  tipo: string;
  color: string;
  idUsuario: string;
}

export interface TipoNoId {
  tipo: string;
  color: string;
  idUsuario: string;
  userDetails?: User;
}

export interface TipoUpdate {
  tipo: string;
  color: string;
  idUsuario?: string;
}
