import {
  DiaryCreate,
  DiaryUpdate,
} from "@/src/diaries/model/interfaces/interfacesDiaries";
import IDiariesDAO from "@/src/diaries/model/dao/IDiariesDAO";

export default class DiariesRepository {
  constructor(private diariesDAO: IDiariesDAO) {}

  getAll(idUser?: string) {
    return this.diariesDAO.getAll(idUser);
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
