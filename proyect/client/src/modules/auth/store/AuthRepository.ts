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

  async logout(): Promise<void> {
    try {
      await this.api.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
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
      console.log("Protected response:", response.status);
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

  async changePassword({
    newPassword,
    actualPassword,
  }: {
    newPassword: string;
    actualPassword: string;
  }): Promise<unknown> {
    try {
      const response = await this.api.patch(
        "/auth/changePassword",
        {
          newPassword: newPassword,
          actualPassword: actualPassword,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Change password response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error at change password:", error);
      throw error;
    }
  }

  async changeEmail({
    newEmail,
    actualEmail,
  }: {
    newEmail: string;
    actualEmail: string;
  }): Promise<unknown> {
    try {
      const response = await this.api.patch(
        "/auth/changeEmail",
        { newEmail, actualEmail },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error at change email:", error);
      throw error;
    }
  }

  async changeUserName({
    newUserName,
    actualUserName,
  }: {
    newUserName: string;
    actualUserName: string;
  }): Promise<unknown> {
    try {
      const response = await this.api.patch(
        "/auth/changeUserName",
        { newUserName, actualUserName },
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error at change email:", error);
      throw error;
    }
  }

  async deleteUser(creedentials: UserLogin): Promise<unknown> {
    try {
      const response = await this.api.post("/auth/delete", creedentials, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error at deleting user:", error);
      throw error;
    }
  }
}
