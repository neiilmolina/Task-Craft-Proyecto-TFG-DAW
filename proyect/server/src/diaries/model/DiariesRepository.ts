import { DiaryCreate, DiaryFilters, DiaryUpdate } from "task-craft-models";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";

export default class DiariesRepository {
  constructor(private diariesDAO: IDiariesDAO) {}

  getAll(diaryFilters?: DiaryFilters) {
    return this.diariesDAO.getAll(diaryFilters);
  }
  getById(idDiary: string) {
    return this.diariesDAO.getById(idDiary);
  }
  create(idDiary: string, Diary: DiaryCreate) {
    return this.diariesDAO.create(idDiary, Diary);
  }
  update(idDiary: string, Diary: DiaryUpdate) {
    return this.diariesDAO.update(idDiary, Diary);
  }
  delete(idDiary: string) {
    return this.diariesDAO.delete(idDiary);
  }
}
