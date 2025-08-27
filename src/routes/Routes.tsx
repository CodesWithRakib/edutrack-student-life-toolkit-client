import { createBrowserRouter } from "react-router";
import PublicLayout from "@/layouts/PublicLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    // children: [
    //   {
    //     index: true,
    //     element: <PublicLayout />,
    //   },
    // ],
  },
]);
