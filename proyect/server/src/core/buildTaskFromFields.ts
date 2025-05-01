import { Temporal } from "@js-temporal/polyfill";
import { format } from "path";
import { Task } from "task-craft-models";
import { formatDate } from "./formatDate";

export function buildTaskFromFields({
  idTask,
  title,
  description,
  activityDate,
  idState,
  state,
  idType,
  type,
  color,
  idUser,
}: {
  idTask: string;
  title: string;
  description: string;
  activityDate: string | Date;
  idState: number;
  state: string;
  idType: number;
  type: string;
  color: string;
  idUser: string;
}): Task {
  return {
    idTask,
    title,
    description,
    activityDate: formatDate(activityDate),
    state: {
      idState,
      state,
    },
    type: {
      idType,
      type,
      color,
    },
    idUser,
  };
}
