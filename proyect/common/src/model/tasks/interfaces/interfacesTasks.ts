import { State } from "@/src/model/states/interfaces/interfacesStates";
import { Temporal } from "@js-temporal/polyfill";

interface TypeTask {
  idType: number;
  type: string;
  color: string;
}

export interface TaskBD {
  idTarea: string;
  titulo: string;
  descripcion: string;
  fechaActividad: string;
  idEstado: number;
  estado: string;
  idTipo: number;
  tipo: string;
  color: string;
  idUsuario: string;
}

export interface Task {
  idTask: string;
  title: string;
  description: string;
  activityDate: Temporal.PlainDateTime;
  state: State;
  type: TypeTask;
  idUser: string;
}

export interface TaskCreate {
  title: string;
  description: string;
  activityDate: string;
  idState: number;
  idType: number;
  idUser: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  activityDate?: string;
  idState?: number;
  idType?: number;
  idUser?: string;
}

export interface TaskReturn {
  idTask: string;
  title: string;
  description: string;
  activityDate: Temporal.PlainDateTime;
  idState: number;
  idType: number;
  idUser: string;
}
