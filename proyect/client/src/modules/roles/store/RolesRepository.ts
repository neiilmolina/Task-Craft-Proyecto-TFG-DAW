import { Role } from "task-craft-models";
import AxiosSingleton from "../../../config/AxiosSingleton";

export default class RolesRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }
  public async getRoles(): Promise<Role[]> {
    const response = await this.api.get("/roles");
    return response.data;
  }
}
