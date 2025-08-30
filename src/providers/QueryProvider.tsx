import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./QueryClient";

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
