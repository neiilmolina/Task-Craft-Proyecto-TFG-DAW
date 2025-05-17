/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiError {
  status?: number;
  data?: {
    error?: string;
    [key: string]: any;
  };
  isAxiosError: boolean;
  message?: string;
}

export interface GenericError {
  message: string;
  error?: string;
}


export type ReduxError = ApiError | GenericError | string | null;
