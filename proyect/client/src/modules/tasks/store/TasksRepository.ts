import AxiosSingleton from "../../../config/AxiosSingleton";
import {
  TaskCreate,
  TaskDTO,
  TaskFilters,
  TaskUpdate,
} from "task-craft-models";

export default class TasksRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;
  private ENDPOINT = "/tasks";

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }

  async getTasks(taskFilters?: TaskFilters): Promise<TaskDTO[]> {
    const params = new URLSearchParams();

    if (taskFilters?.idUser) {
      params.append("idUser", taskFilters.idUser);
    }

    Object.entries(taskFilters || {}).forEach(([key, value]) => {
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

    const data = response.data as TaskDTO[];

    return data;
  }

  async getTaskById(id: string): Promise<TaskDTO> {
    const response = await this.api.get(`${this.ENDPOINT}/${id}`);
    const data = response.data as TaskDTO;

    return data;
  }

  async addTask(taskCreate: TaskCreate): Promise<void> {
    await this.api.post(`${this.ENDPOINT}`, taskCreate);
  }

  async updateTask(id: string, taskUpdate: TaskUpdate): Promise<void> {
    await this.api.put(`${this.ENDPOINT}/${id}`, taskUpdate);
  }

  async deleteTask(id: string): Promise<void> {
    await this.api.delete(`${this.ENDPOINT}/${id}`);
  }
}
