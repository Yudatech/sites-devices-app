import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginAndSites from "./Root";
import { AuthProvider } from "./hooks/authContext";

const client = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <AuthProvider>
        <LoginAndSites />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
