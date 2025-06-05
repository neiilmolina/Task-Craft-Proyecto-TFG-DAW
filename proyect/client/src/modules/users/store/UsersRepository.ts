import { User, UserCreate, UserFilter, UserUpdate } from "task-craft-models";
import AxiosSingleton from "../../../config/AxiosSingleton";


export default class UsersRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;
  private ENDPOINT = "/users";

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }

  async getUsers(taskFilters?: UserFilter): Promise<User[]> {
    const params = new URLSearchParams();

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

    const data = response.data as User[];

    return data;
  }

  async getUserById(id: string): Promise<User> {
    const response = await this.api.get(`${this.ENDPOINT}/${id}`);
    const data = response.data as User;

    return data;
  }

  async addUser(taskCreate: UserCreate): Promise<void> {
    await this.api.post(`${this.ENDPOINT}/create`, taskCreate);
  }

  async updateUser(id: string, taskUpdate: UserUpdate): Promise<void> {
    await this.api.put(`${this.ENDPOINT}/update/${id}`, taskUpdate);
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`${this.ENDPOINT}/${id}`);
  }
}
