import axios, { AxiosInstance } from "axios";

class AxiosSingleton {
  private static instance: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosInstance {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      AxiosSingleton.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          console.error("Axios error:", error);
          return Promise.reject(error);
        }
      );
    }

    return AxiosSingleton.instance;
  }
}

export default AxiosSingleton;
