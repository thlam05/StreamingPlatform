import { createBrowserRouter, Navigate } from "react-router";

import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

import { PATHS } from "./paths";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: PATHS.PUBLIC.HOME, element: <HomePage /> }],
  },
  { path: PATHS.PUBLIC.LOGIN, element: <LoginPage /> },
  { path: PATHS.PUBLIC.REGISTER, element: <RegisterPage /> },
  { path: "/login", element: <Navigate to={PATHS.PUBLIC.LOGIN} replace /> },
  { path: "/register", element: <Navigate to={PATHS.PUBLIC.REGISTER} replace /> },
  { path: "*", element: <Navigate to={PATHS.PUBLIC.HOME} replace /> },
]);
