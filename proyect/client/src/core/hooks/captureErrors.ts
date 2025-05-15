/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export function handleThunkError<T>(
  error: any,
  rejectWithValue: (value: T) => any,
  message: string
) {
  if (axios.isAxiosError(error)) {
    return rejectWithValue({
      status: error.response?.status,
      data: error.response?.data,
      isAxiosError: true,
    } as T);
  }

  return rejectWithValue({
    message: message,
    error: String(error),
  } as T);
}
