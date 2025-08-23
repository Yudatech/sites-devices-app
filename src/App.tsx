import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { login } from "./api";
import type { User } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardHeader } from "./components/PageHeader";
import { SitesContent } from "./components/SitesContent";

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
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user && window.location.pathname !== "/login") {
      window.history.replaceState(null, "", "/login");
    }
    if (user && window.location.pathname === "/login") {
      window.history.replaceState(null, "", "/");
    }
  }, [user]);

  useEffect(() => {
    const raw = localStorage.getItem("currentUser");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const u = await login(username, password);
      setUser(u);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Sites & Devices
              </CardTitle>
              <CardDescription className="mt-2">
                Sign in to access your sites
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username">
                  Username
                  <Input
                    data-testid="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              </div>
              <div className="space-y-2">
                <label htmlFor="password">
                  Password
                  <Input
                    data-testid="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                data-testid="sign-in-button"
                type="submit"
                className="w-full transition-all hover:scale-[1.02]"
              >
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
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
