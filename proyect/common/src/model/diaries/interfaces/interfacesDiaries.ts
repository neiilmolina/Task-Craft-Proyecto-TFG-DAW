import { Temporal } from "@js-temporal/polyfill";

export interface DiaryBD {
  idDiario: string;
  titulo: string;
  descripcion: string;
  fechaActividad: string;
  idUsuario: string;
}

export interface Diary {
  idDiary: string;
  title: string;
  description: string;
  activityDate: Temporal.PlainDateTime;
  idUser: string;
}

export interface DiaryDTO {
  idDiary: string;
  title: string;
  description: string;
  activityDate: string;
  idUser: string;
}

export interface DiaryCreate {
  title: string;
  description: string;
  activityDate: string;
  idUser: string;
}

export interface DiaryUpdate {
  title?: string;
  description?: string;
  idUser?: string;
}

export interface DiaryReturn {
  idDiary: string;
  title: string;
  description: string;
  activityDate: Temporal.PlainDateTime;
  idUser: string;
}

export interface DiaryFilters {
  idUser?: string;
  futureDate?: string;
  pastDate?: string;
  title?: string;
}
