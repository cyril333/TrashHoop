import { createBrowserRouter, redirect } from "react-router";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import WasteGuidePage from "./pages/WasteGuidePage";
import ReportPage from "./pages/ReportPage";
import RoutesPage from "./pages/RoutesPage";
import ViolationsPage from "./pages/ViolationsPage";
import SchedulePage from "./pages/SchedulePage";
import EducationPage from "./pages/EducationPage";
import UsersPage from "./pages/UsersPage";

function requireAuth() {
  const role = localStorage.getItem("trashhoop_role");
  if (!role) {
    return redirect("/login");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/app",
    Component: Layout,
    loader: requireAuth,
    children: [
      {
        index: true,
        loader: () => redirect("/app/dashboard"),
      },
      {
        path: "dashboard",
        Component: DashboardPage,
      },
      {
        path: "waste-guide",
        Component: WasteGuidePage,
      },
      {
        path: "report",
        Component: ReportPage,
      },
      {
        path: "routes",
        Component: RoutesPage,
      },
      {
        path: "violations",
        Component: ViolationsPage,
      },
      {
        path: "schedule",
        Component: SchedulePage,
      },
      {
        path: "education",
        Component: EducationPage,
      },
      {
        path: "users",
        Component: UsersPage,
      },
    ],
  },
  {
    path: "*",
    loader: () => redirect("/"),
  },
]);
