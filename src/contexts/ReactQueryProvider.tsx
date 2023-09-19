import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [internalQueryClient] = useState(() => queryClient);

  return (
    <QueryClientProvider client={internalQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
