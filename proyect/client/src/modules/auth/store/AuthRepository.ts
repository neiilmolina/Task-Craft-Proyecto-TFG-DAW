import AxiosSingleton from "../../../config/AxiosSingleton";
import { UserCreate } from "task-craft-models";

const axios = AxiosSingleton.getInstance();

export default class AuthRepository {
  async getAuthenticatedUser(): Promise<unknown> {
    try {
      const response = await axios.get("/auth/");
      return response.data;
    } catch (error) {
      console.error("Error fetching authenticated user:", error);
      throw error;
    }
  }

  async register(user: UserCreate): Promise<unknown> {
    try {
      const response = await axios.post("/auth/register", user);
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<unknown> {
    try {
      const response = await axios.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Error login user:", error);
      throw error;
    }
  }

  async logout(): Promise<unknown> {
    try {
      const response = await axios.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error at logout:", error);
      throw error;
    }
  }

  async protected(): Promise<unknown> {
    try {
      const response = await axios.get("/auth/protected");
      return response.data;
    } catch (error) {
      console.error("Error at protected:", error);
      throw error;
    }
  }

  async refreshToken(): Promise<unknown> {
    try {
      const response = await axios.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.error("Error at refresh token:", error);
      throw error;
    }
  }
}
