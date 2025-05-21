import AxiosSingleton from "../../../config/AxiosSingleton";
import { TaskDTO, TaskFilters } from "task-craft-models";

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

    console.log("TasksRepository.getTasks:", data);
    return data;
  }

  async getTaskById(id: string): Promise<TaskDTO> {
    const response = await this.api.get(`${this.ENDPOINT}/${id}`);
    const data = response.data as TaskDTO;

    return data;
  }
}
