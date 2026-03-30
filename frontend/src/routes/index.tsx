import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/app-layout";
import { SignInPage } from "../pages/auth/sign-in";
import { DashboardPage } from "../pages/dashboard";
import { CreateTicketPage } from "../pages/tickets/create-ticket";
import { ListTicketsPage } from "../pages/tickets/list-tickets";
import { TicketDetailsPage } from "../pages/tickets/ticket-details";
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

