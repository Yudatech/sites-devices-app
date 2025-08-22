import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSitesByOwner, login } from "./hooks/useSitesByOwner";
import type { User } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginAndSites() {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  // 1) Login mutation
  const {
    mutate: doLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
    onSuccess: (u) => setUser(u), // <-- triggers sites query below
  });

  // 2) Fetch sites owned by this user
  const ownerKey = user?.username;
  const {
    data: sites,
    isLoading: sitesLoading,
    isError,
  } = useSitesByOwner(ownerKey);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username and password are required");
      return;
    }
    doLogin({ username, password });
  };

  const logout = () => {
    setUser(null);
    qc.removeQueries({ queryKey: ["sites"] }); // hygiene: clear cached sites
  };

  if (!user) {
    return (
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 360 }}
      >
        <h1>Login</h1>
        <label>
          Username
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && (
          <p style={{ color: "crimson" }}>{(error as Error).message}</p>
        )}
        <Button
          type="submit"
          variant="outline"
          className="w-full transition-all hover:scale-[1.02]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
              Signing in...
            </>
          ) : (
            <>
              {/* <LogIn className="mr-2 h-4 w-4" /> */}
              Sign In
            </>
          )}
        </Button>
        {/* <Button type="submit" disabled={isPending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button> */}
      </form>
    );
  }

  return (
    <div className="grid gap-4">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Sites for {ownerKey}</h2>
        <Button onClick={logout}>Logout</Button>
      </div>

      {sitesLoading && <p>Loading sites…</p>}
      {isError && <p>Could not load sites.</p>}
      {!sitesLoading && !sites?.length && <p>No sites for this user.</p>}

      <ul>
        {sites?.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
