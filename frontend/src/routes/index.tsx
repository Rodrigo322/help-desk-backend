import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/app-layout";
import { SignInPage } from "../pages/auth/sign-in";
import { DashboardPage } from "../pages/dashboard";
import { CreateDepartmentPage } from "../pages/departments/create-department";
import { EditDepartmentPage } from "../pages/departments/edit-department";
import { ListDepartmentsPage } from "../pages/departments/list-departments";
import { NotificationsPage } from "../pages/notifications";
import { CreateTicketPage } from "../pages/tickets/create-ticket";
import { ListTicketsPage } from "../pages/tickets/list-tickets";
import { TicketDetailsPage } from "../pages/tickets/ticket-details";
import { CreateUserPage } from "../pages/users/create-user";
import { EditUserPage } from "../pages/users/edit-user";
import { ListUsersPage } from "../pages/users/list-users";
import { AdminRoute } from "./admin-route";
import { ProtectedRoute } from "./protected-route";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignInPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />
          },
          {
            path: "/tickets",
            element: <ListTicketsPage />
          },
          {
            path: "/tickets/new",
            element: <CreateTicketPage />
          },
          {
            path: "/tickets/:id",
            element: <TicketDetailsPage />
          },
          {
            path: "/notifications",
            element: <NotificationsPage />
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/users",
                element: <ListUsersPage />
              },
              {
                path: "/users/new",
                element: <CreateUserPage />
              },
              {
                path: "/users/:id/edit",
                element: <EditUserPage />
              },
              {
                path: "/departments",
                element: <ListDepartmentsPage />
              },
              {
                path: "/departments/new",
                element: <CreateDepartmentPage />
              },
              {
                path: "/departments/:id/edit",
                element: <EditDepartmentPage />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
