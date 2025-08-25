// Simple factory to build devices
export function makeDevice(overrides: Partial<any> = {}) {
  return {
    id: 1,
    title: "Temp Sensor",
    description: "Main hallway",
    model: "TS-100",
    version: "1.2.3",
    timezone: "Europe/Stockholm",
    enabled: true,
    connected: true,
    storage: [
      { id: "sd-1", state: "ok" },
      { id: "ssd-2", state: "warn" },
    ],
    ...overrides,
  } as any;
}
