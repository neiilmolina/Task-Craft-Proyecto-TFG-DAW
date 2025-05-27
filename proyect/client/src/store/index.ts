import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../modules/auth/store/redux/authSlice";
import typesReducer from "../modules/types/store/redux/typesSlice";
import statesReducer from "../modules/states/store/redux/statesSlice";
import tasksReducer from "../modules/tasks/store/redux/tasksSlice";
import diariesReducer from "../modules/diaries/store/redux/diariesSlice";
import usersReducer from "../modules/users/store/redux/usesrSlice";
import rolesReducer from "../modules/roles/store/redux/rolesSlice";

export const store = configureStore({
  // Reducers that defines the structure of the global state
  reducer: {
    auth: authReducer,
    types: typesReducer,
    states: statesReducer,
    tasks: tasksReducer,
    diaries: diariesReducer,
    users: usersReducer,
    roles: rolesReducer,
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
