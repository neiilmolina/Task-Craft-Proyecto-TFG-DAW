import { Temporal } from "@js-temporal/polyfill";
import AxiosSingleton from "../../../config/AxiosSingleton";
import { Task, TaskFilters } from "task-craft-models";

export default class TasksRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }

  async getTasks(taskFilters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();

    if (taskFilters?.idUser) {
      params.append("idUser", taskFilters.idUser);
    }

    // Add the rest of the filters except idUser
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
    const queryString = `/tasks?${query}`;

    const response = await this.api.get(queryString);

    const data = response.data as Task[];

    return data.map((task) => {
      return {
        ...task,
        activityDate: Temporal.PlainDateTime.from(task.activityDate),
      };
    });
  }
}
