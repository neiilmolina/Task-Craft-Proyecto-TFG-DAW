import { Temporal } from "@js-temporal/polyfill";
import { Task } from "task-craft-models";

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
  let dateFormatted;

  if (activityDate instanceof Date) {
    const isoString = activityDate.toISOString().replace("Z", "");
    dateFormatted = Temporal.PlainDateTime.from(isoString);
  } else if (typeof activityDate === "string") {
    dateFormatted = Temporal.PlainDateTime.from(activityDate.replace(" ", "T"));
  } else {
    throw new Error("❌ Tipo de fecha inesperado: " + typeof activityDate);
  }

  return {
    idTask,
    title,
    description,
    activityDate: dateFormatted,
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
