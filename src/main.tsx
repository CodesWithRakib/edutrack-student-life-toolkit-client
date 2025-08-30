import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RouterProvider } from "react-router";
import { router } from "./routes/Routes";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { Toaster } from "sonner";
import { QueryProvider } from "./providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <RouterProvider router={router} />
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  </StrictMode>
);
