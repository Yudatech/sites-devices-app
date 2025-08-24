import type { User } from "@/types";
import { api } from "./client";

/**
 * Login using json-server's /users filter-by-params.
 * NOTE: json-server isn't real auth; it just filters by fields.
 * Throws "Invalid credentials" when no match is found.
 */
export async function login(username: string, password: string): Promise<User> {
  if (!username?.trim() || !password?.trim()) {
    throw new Error("Username and password are required");
  }

  try {
    const { data } = await api.get<User[]>("/users", {
      params: { username, password },
    });
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid credentials");
    }
    return data[0];
  } catch (err: any) {
    const msg =
      err?.message ||
      (err?.response?.status
        ? `Login failed (HTTP ${err.response.status})`
        : "Login failed");
    throw new Error(msg);
  }
}
