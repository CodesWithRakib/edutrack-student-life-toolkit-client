import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
import Home from "@/pages/landing/Home";
import Features from "@/pages/Features";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "features",
        element: <Features />,
      },
    ],
  },
]);
