import { useEffect, useMemo, useState } from "react";
import type { User } from "./types";
import { getSitesForUser, login } from "./api";

export default function App() {
  return <Root />;
}

function Root() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const u = await login(email, password);
      setUser(u);
    } catch (err: any) {
      setError(err.message ?? "Login failed");
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 360 }}>
        <h1>Login</h1>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome to the Sites & Devices App</h1>
    </div>
  );
}
