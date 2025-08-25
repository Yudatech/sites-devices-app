import { useState } from "react";
import type { User } from "@/types";
import { login } from "@/api/auth";
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

/** Props allow parent to handle successful login and persistence. */
type LoginFormProps = {
  onSuccess(user: User): void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  // Local UI state only (keep this component self-contained and reusable)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // UX states for submit lifecycle + server errors
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** -------------------------------------------------------------------------
   * Handle form submission:
   * - Prevent default page reload
   * - Clear prior error
   * - Call the login API (json-server filter query)
   * - Notify parent via onSuccess(user)
   * - Release the "submitting" lock
   * Note: error messages are already human-friendly in the API layer.
   * ------------------------------------------------------------------------ */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(username, password);
      onSuccess(user);
    } catch (err: any) {
      // Fallback "Login failed" covers network/unknown issues
      setError(err?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Full-screen center layout with a subtle gradient background.
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
                  id="username"
                  data-testid="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>
            </div>
            <div className="space-y-2">
              <label htmlFor="password">
                Password
                <Input
                  id="password"
                  data-testid="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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
              className="w-full transition-all hover:scale-[1.02] cursor-pointer"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
