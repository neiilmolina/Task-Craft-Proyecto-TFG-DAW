import { State } from "task-craft-models";
import AxiosSingleton from "../../../config/AxiosSingleton";

export default class StatesRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }
  public async getStates(): Promise<State[]> {
    const response = await this.api.get("/states");
    return response.data;
  }
}
