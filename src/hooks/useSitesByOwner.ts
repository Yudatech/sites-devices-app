import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import type { Site, User } from "../types";
import axios from "axios";

const api = axios.create({ baseURL: "" });

export async function login(username: string, password: string): Promise<User> {
  const { data } = await api.get<User[]>(`/users`, {
    params: { username, password },
  });
  if (!data.length) throw new Error("Invalid credentials");
  return data[0];
}

async function getSitesByOwner(owner: string): Promise<Site[]> {
  const { data } = await api.get<Site[]>("/sites", {
    params: { owner, _embed: "devices" },
  });
  return data;
}

export function useSitesByOwner(
  owner?: string,
  options?: Omit<UseQueryOptions<Site[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<Site[], Error>({
    queryKey: ["sites", { owner }],
    queryFn: () => getSitesByOwner(owner as string),
    enabled: !!owner, // <-- auto-run after login sets owner
    staleTime: 60_000,
    ...options,
  });
}
