import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "./types";
import { DashboardHeader } from "./components/PageHeader";
import { SitesContent } from "./components/SitesContent";
import { LoginForm } from "./components/LoginForm";

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <Root />
    </QueryClientProvider>
  );
}

function Root() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user && window.location.pathname !== "/login") {
      window.history.replaceState(null, "", "/login");
    }
    if (user && window.location.pathname === "/login") {
      window.history.replaceState(null, "", "/");
    }
  }, [user]);

  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (!user) {
    return <LoginForm onSuccess={setUser} />;
  }

  return (
    <div
      className="min-h-screen bg-background"
      data-testid="root-sites-overview"
    >
      <DashboardHeader user={user} logout={logout} />
      <SitesContent user={user} />
    </div>
  );
}
