import {
  Diary,
  DiaryCreate,
  DiaryUpdate,
  DiaryReturn,
  DiaryFilters,
} from "task-craft-models";

export default interface IDiariesDAO {
  getAll(diaryFilters?: DiaryFilters): Promise<Diary[]>;
  getById(idDiary: string): Promise<Diary | null>;
  create(idDiary: string, diary: DiaryCreate): Promise<DiaryReturn | null>;
  update(idDiary: string, diary: DiaryUpdate): Promise<DiaryReturn | null>;
  delete(idDiary: string): Promise<boolean>;
}
