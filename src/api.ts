import axios from "axios";
import type { Site, User } from "@/types";

// When served by json-server, the UI and API share the same origin (http://localhost:4000)
const api = axios.create({ baseURL: "" });

export async function login(email: string, password: string): Promise<User> {
  const { data } = await api.get<User[]>(`/users`, {
    params: { email, password },
  });
  if (!data.length) throw new Error("Invalid credentials");
  return data[0];
}

export async function getSitesForUser(userId: number): Promise<Site[]> {
  const { data } = await api.get<Site[]>(`/sites`, {
    params: { userId, _embed: "devices" },
  });
  return data;
}
