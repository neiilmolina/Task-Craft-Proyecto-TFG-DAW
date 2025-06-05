import { Type } from "task-craft-models";
import AxiosSingleton from "../../../config/AxiosSingleton";

export default class TypesRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }
  public async getTypes(): Promise<Type[]> {
    const response = await this.api.get("/types");
    return response.data;
  }
}
