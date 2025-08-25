import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "./types";
import { DashboardHeader } from "./components/PageHeader";
import { SitesContent } from "./components/SitesContent";
import { LoginForm } from "./components/LoginForm";

const client = new QueryClient();

export default function App() {
  /**
   * Provide React Query to the component tree.
   * Everything inside can use useQuery.
   */
  return (
    <QueryClientProvider client={client}>
      <Root />
    </QueryClientProvider>
  );
}

function Root() {
  /**
   * App-level auth state.
   * - null  => no authenticated user (show <LoginForm/>)
   * - User  => authenticated (show states overview)
   */
  const [user, setUser] = useState<User | null>(null);

  /**
   * Naive routing guard:
   * - If not logged in and not already on /login, redirect to /login.
   * - If logged in and currently on /login, redirect to /.
   *
   * This uses history.replaceState to keep it framework-free (no React Router).
   * NOTE: This is purely cosmetic URL handling; it’s not a security boundary.
   */
  useEffect(() => {
    if (!user && window.location.pathname !== "/login") {
      window.history.replaceState(null, "", "/login");
    }
    if (user && window.location.pathname === "/login") {
      window.history.replaceState(null, "", "/");
    }
  }, [user]);

  /**
   * On first mount, read any previously stored user from localStorage
   */
  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  /**
   * Session persistence:
   * Whenever `user` changes, write/remove it from localStorage.
   * This keeps login state across page reloads.
   */
  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  /**
   * Logout handler:
   * - Clear in-memory user
   * - Clear browser storage
   */

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  /**
   * If not authenticated, render the login form.
   */
  if (!user) {
    return <LoginForm onSuccess={setUser} />;
  }

  /**
   * Authenticated view: header + sites overview content.
   * `data-testid` enables reliable selection in unit/e2e tests.
   */
  return (
    <div
      className="min-h-screen bg-background"
      data-testid="root-sites-overview"
    >
      <DashboardHeader user={user} logout={logout} />
      {/* TODO: Wrapp ErrorBoundary */}
      <SitesContent user={user} />
    </div>
  );
}
