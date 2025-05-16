import {  Route } from "react-router-dom";
import routesAuth from "./routesAuth";

export default function AuthRoutes() {
  return (
    <>
      {routesAuth.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<route.Component />}
        />
      ))}
    </>
  );
}
