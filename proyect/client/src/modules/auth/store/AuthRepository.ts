import AxiosSingleton from "../../../config/AxiosSingleton";
import { UserCreate, UserLogin, UserToken } from "task-craft-models";

export default class AuthRepository {
  private api: ReturnType<typeof AxiosSingleton.getInstance>;

  constructor() {
    this.api = AxiosSingleton.getInstance();
  }

  async getAuthenticatedUser(): Promise<UserToken> {
    const response = await this.api.get("/auth/", {
      withCredentials: true,
    });

    return response.data.user;
  }

  async register(user: UserCreate): Promise<unknown> {
    return await this.api.post("/auth/register", user);
  }

  async login(creedentials: UserLogin): Promise<unknown> {
    const result = await this.api.post("/auth/login", creedentials, {
      withCredentials: true,
    });
    console.log(result.data);
    return result;
  }

  async logout(): Promise<unknown> {
    try {
      const response = await this.api.post("/auth/logout", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error at logout:", error);
      throw error;
    }
  }

  async protected(): Promise<boolean> {
    try {
      const response = await this.api.get("/auth/protected", {
        withCredentials: true,
      });
      return response.status === 200;
    } catch (error) {
      console.error("Error at protected:", error);
      return false;
    }
  }

  async refreshToken(): Promise<unknown> {
    try {
      const response = await this.api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.error("Error at refresh token:", error);
      throw error;
    }
  }
}
