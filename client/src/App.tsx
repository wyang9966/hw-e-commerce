import { MantineProvider } from "@mantine/core";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";

import "@mantine/core/styles.css";

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <RouterProvider router={router} />
        </MantineProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
