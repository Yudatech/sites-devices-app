import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../hooks/authContext";
import { Shield, AlertCircle } from "lucide-react";
import { login } from "../hooks/useSitesByOwner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     setError(null);
  //     setIsLoading(true);

  //     if (!username.trim() || !password.trim()) {
  //       setError("Please enter both username and password");
  //       setIsLoading(false);
  //       return;
  //     }

  //     try {
  //       const user = await login(username.trim(), password);
  //     } catch (err) {
  //       const msg = err instanceof Error ? err.message : "Login failed";
  //       setError(msg);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    const user = await login(username.trim(), password);
    console.log("Login user:", user);
    if (!user.id) {
      setError("Login failed");
    }
    setIsLoading(false);

    // try {
    //   const user = await login(username.trim(), password);
    //   setUsername(user.username);
    // } catch (err: any) {
    //   setError(err?.message || "Something went wrong logging you in");
    // } finally {
    //   setIsLoading(false);
    // }
  };

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
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              //   <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
