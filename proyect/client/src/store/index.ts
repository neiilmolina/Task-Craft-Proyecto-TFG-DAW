import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/store/redux/authSlice";


export const store = configureStore({
  // Reducers that defines the structure of the global state
  reducer: {
    auth: authReducer,
  },
  // Middleware for the synchronization with the database
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat
      //   syncWithDatabaseMiddlewareTasks,
      //   syncWithDatabaseMiddlewareDiaries,
      //   syncWithDatabaseMiddlewareUsers
      (),
});

// Definición de tipos para el estado global y el dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
