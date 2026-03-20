import type { RouteProps } from "react-router-dom";
import UsersPage from "../pages/UsersPage";
import MainPage from "../pages/MainPage";

export const AppRoutes = {
  MAIN: "main",
  USERS: "users",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: "/",
  [AppRoutes.USERS]: "/users",
};

export const RouteConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RoutePath.main,
    element: <MainPage />,
  },
  [AppRoutes.USERS]: {
    path: RoutePath.users,
    element: <UsersPage />,
  },
};
