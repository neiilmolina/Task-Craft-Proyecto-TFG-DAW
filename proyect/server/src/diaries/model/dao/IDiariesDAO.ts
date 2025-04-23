import {
  Diary,
  DiaryCreate,
  DiaryUpdate,
  DiaryReturn,
} from "task-craft-models/src/model/diaries/interfaces/interfacesDiaries";

export default interface IDiariesDAO {
  getAll(idUser?: string): Promise<Diary[]>;
  getById(idDiary: string): Promise<Diary | null>;
  create(idDiary: string, diary: DiaryCreate): Promise<DiaryReturn | null>;
  update(idDiary: string, diary: DiaryUpdate): Promise<DiaryReturn | null>;
  delete(idDiary: string): Promise<boolean>;
}
