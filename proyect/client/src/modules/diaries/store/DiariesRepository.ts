import {
  DiaryCreate,
  DiaryDTO,
  DiaryFilters,
  DiaryUpdate,
} from "task-craft-models";
import AxiosSingleton from "../../../config/AxiosSingleton";

export default class DiariesRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;
  private ENDPOINT = "/diaries";

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }

  async getDiaries(diaryFilters?: DiaryFilters): Promise<DiaryDTO[]> {
    const params = new URLSearchParams();

    if (diaryFilters?.idUser) {
      params.append("idUser", diaryFilters.idUser);
    }

    Object.entries(diaryFilters || {}).forEach(([key, value]) => {
      if (
        key !== "idUser" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params.append(key, value);
      }
    });

    const query = params.toString();
    const queryString = `${this.ENDPOINT}?${query}`;

    const response = await this.api.get(queryString);

    const data = response.data as DiaryDTO[];

    return data;
  }

  async getDiaryById(id: string): Promise<DiaryDTO> {
    const response = await this.api.get(`${this.ENDPOINT}/${id}`);
    const data = response.data as DiaryDTO;

    return data;
  }

  async addDiary(diaryCreate: DiaryCreate): Promise<void> {
    await this.api.post(`${this.ENDPOINT}`, diaryCreate);
  }

  async updateDiary(id: string, diaryUpdate: DiaryUpdate): Promise<void> {
    await this.api.put(`${this.ENDPOINT}/${id}`, diaryUpdate);
  }

  async deleteDiary(id: string): Promise<void> {
    await this.api.delete(`${this.ENDPOINT}/${id}`);
  }
}
