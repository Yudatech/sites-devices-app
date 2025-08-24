import { describe, it, expect, beforeEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import { api } from "@/api/client";
import { getSitesByOwner, type SiteWithDevices } from "@/api/siteService";
import type { Site, Device } from "../../types";

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(api);
  mock.reset();
});

describe("getSitesByOwner()", () => {
  it("returns [] when owner has no sites", async () => {
    mock.onGet("/sites", { params: { owner: "nobody" } }).reply(200, []);
    const result = await getSitesByOwner("nobody");
    expect(result).toEqual([]);
  });

  it("throws when owner is empty", async () => {
    await expect(getSitesByOwner("")).rejects.toThrow("Owner is required");
  });

  it("returns sites with grouped devices and preserves site order", async () => {
    const sites: Site[] = [
      { id: 2, title: "Beta", owner: 1, devices: [] },
      { id: 1, title: "Alpha", owner: 1, devices: [] },
      { id: 3, title: "Gamma", owner: 1, devices: [] },
    ];

    const devices: Device[] = [
      {
        id: 1,
        site_id: 2,
        title: "A-1",
        description: "gate 1",
        model: "model-1",
        version: "1-1",
        enabled: true,
        connected: true,
        timezone: "CET-1",
        storage: [],
      },
      {
        id: 20,
        site_id: 2,
        title: "B-1",
        description: "gate 2",
        model: "model-1",
        version: "1-1",
        enabled: true,
        connected: true,
        timezone: "CET-1",
        storage: [],
      },
      {
        id: 21,
        site_id: 2,
        title: "C-2",
        description: "gate 3",
        model: "model-1",
        version: "1-1",
        enabled: true,
        connected: true,
        timezone: "CET-1",
        storage: [],
      },
      {
        id: 22,
        site_id: 999,
        title: "C-4",
        description: "gate 5",
        model: "model-4",
        version: "1-1",
        enabled: true,
        connected: true,
        timezone: "CET-1",
        storage: [],
      },
    ];

    mock.onGet("/sites", { params: { owner: "alice" } }).reply(200, sites);

    // We don't strictly validate params here; reply regardless of query
    mock.onGet("/devices").reply((config) => {
      // Optional: verify the repeated site_id params were sent
      const qp = config.params as
        | URLSearchParams
        | Record<string, any>
        | undefined;
      if (qp instanceof URLSearchParams) {
        const siteIds = qp.getAll("site_id");
        expect(new Set(siteIds)).toEqual(new Set(["2", "1", "3"]));
      }
      return [200, devices];
    });

    const result = await getSitesByOwner("alice");
    // Preserve site order and attach only relevant devices
    const expected: SiteWithDevices[] = [
      { ...sites[0], devices: devices.filter((d) => d.site_id === 2) },
      { ...sites[1], devices: devices.filter((d) => d.site_id === 1) },
      { ...sites[2], devices: [] },
    ];
    expect(result).toEqual(expected);
  });

  it("propagates HTTP errors from /sites", async () => {
    mock.onGet("/sites").reply(500);
    await expect(getSitesByOwner("alice")).rejects.toThrow();
  });

  it("handles /devices returning empty array", async () => {
    const sites: Site[] = [{ id: 1, title: "Only", owner: 1, devices: [] }];

    mock.onGet("/sites", { params: { owner: "alice" } }).reply(200, sites);
    mock.onGet("/devices").reply(200, []);

    const result = await getSitesByOwner("alice");
    expect(result).toEqual([{ ...sites[0], devices: [] }]);
  });
});
