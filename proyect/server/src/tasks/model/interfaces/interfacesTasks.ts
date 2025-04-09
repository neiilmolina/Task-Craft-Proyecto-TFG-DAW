import { State } from "@/src/states/model/interfaces/interfacesStates";
import { Temporal } from "@js-temporal/polyfill";

interface TypeTask {
  idType: number;
  type: string;
  color: string;
}

export interface TaskBD {
  idTask: string;
  title: string;
  description: string;
  activityDate: Temporal.PlainDateTime;
  idState: number;
  state: string;
  idType: number;
  type: string;
  color: string;
  idUser: string;
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
  activityDate: Temporal.PlainDateTime;
  idState: number;
  idType: number;
  idUser: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  activityDate?: Temporal.PlainDateTime;
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
