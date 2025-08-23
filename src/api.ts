import type { Site, User, Device } from "@/types";
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
  // 1) Get sites
  const { data: sites } = await api.get<Site[]>("/sites", {
    params: { owner },
  });
  if (!sites?.length) return [];

  // 2) Build query as repeated site_id params: /devices?site_id=1&site_id=2...
  const params = new URLSearchParams();
  for (const { id } of sites) params.append("site_id", String(id));

  // 3) Fetch all devices for those sites
  const { data: devices = [] } = await api.get<Device[]>("/devices", {
    params,
  });

  // 4) Group devices by site_id
  const bySite = devices.reduce<Map<number, Device[]>>((map, d) => {
    const arr = map.get(d.site_id);
    if (arr) arr.push(d);
    else map.set(d.site_id, [d]);
    return map;
  }, new Map());

  // 5) Attach devices to their sites (preserves site order)
  return sites.map((s) => ({
    ...s,
    devices: bySite.get(s.id) ?? [],
  }));
}
