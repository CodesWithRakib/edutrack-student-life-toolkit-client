import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import Home from "@/pages/landing/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
]);
