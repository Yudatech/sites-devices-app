import type { Site, User } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

export async function login(username: string, password: string): Promise<User> {
  const { data } = await api.get<User[]>(`/users`, {
    params: { username, password },
  });

  if (!data.length) throw new Error("Invalid credentials");
  return data[0];
}

export async function getSitesByOwner(owner: string): Promise<Site[]> {
  const { data } = await api.get<Site[]>("/sites", {
    params: { owner, _embed: "devices" },
  });
  return data;
}
