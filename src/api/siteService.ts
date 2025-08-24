import type { Site, User, Device } from "@/types";
import { api } from "./client";

/** Enrich Site with its devices. */
export type SiteWithDevices = Site & { devices: Device[] };

/**
 * Given an owner username, fetch their sites and attach all devices
 * that belong to those site IDs. Order of sites is preserved.
 *
 * Steps:
 *  1) GET /sites?owner=<owner>
 *  2) Build /devices query with repeated site_id params: ?site_id=1&site_id=2
 *  3) GET /devices for those site_ids
 *  4) Group devices by site_id
 *  5) Map devices back onto the original sites array (preserving order)
 */
export async function getSitesByOwner(
  owner: string
): Promise<SiteWithDevices[]> {
  if (!owner?.trim()) {
    throw new Error("Owner is required");
  }

  // 1) Get sites
  const { data: sites } = await api.get<Site[]>("/sites", {
    params: { owner },
  });
  if (!Array.isArray(sites) || sites.length === 0) return [];

  // 2) Build query as repeated site_id params
  const params = new URLSearchParams();
  for (const { id } of sites) params.append("site_id", String(id));

  // 3) Fetch all devices for those sites
  const { data: devices = [] } = await api.get<Device[]>("/devices", {
    params,
  });

  // 4) Group devices by site_id for quick lookups
  const bySite = devices.reduce<Map<number, Device[]>>((map, d) => {
    const arr = map.get(d.site_id);
    if (arr) arr.push(d);
    else map.set(d.site_id, [d]);
    return map;
  }, new Map());

  // 5) Attach devices to their sites (preserves site order)
  return sites.map<SiteWithDevices>((s) => ({
    ...s,
    devices: bySite.get(s.id) ?? [],
  }));
}
