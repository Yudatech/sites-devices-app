import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceCard } from "../DeviceCard";
import { describe, test, expect } from "vitest";

// Simple factory to build devices
function makeDevice(overrides: Partial<any> = {}) {
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
  } as any; // cast to avoid over-constraining optional fields in tests
}

describe("<DeviceCard />", () => {
  test("renders header info and connected badge", () => {
    const device = makeDevice({ connected: true });
    render(<DeviceCard device={device} />);

    // Header basics
    expect(screen.getByText(device.title)).toBeInTheDocument();
    expect(
      screen.getByText(`${device.description} | ${device.model}`)
    ).toBeInTheDocument();

    // Top-right status badge
    expect(screen.getAllByText(/Connected/i).length).toBeGreaterThan(0);
  });

  test("is collapsed by default and expands on toggle", async () => {
    const user = userEvent.setup();
    const device = makeDevice();
    const { container } = render(<DeviceCard device={device} />);

    // Collapsed section div has overflow-hidden + max-h-0 classes
    const details = container.querySelector(
      "div.overflow-hidden"
    ) as HTMLElement;
    expect(details).toBeTruthy();
    expect(details).toHaveClass("max-h-0");
    expect(details).toHaveClass("opacity-0");

    // Toggle (the only button in this card)
    const toggleBtn = screen.getByRole("button");
    await user.click(toggleBtn);

    // Now expanded
    expect(details).toHaveClass("max-h-96");
    expect(details).toHaveClass("opacity-100");

    // Specs become visible in DOM; assert some rows
    expect(screen.getByText(/Specifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Model:/i)).toBeInTheDocument();
    expect(screen.getByText(device.model)).toBeInTheDocument();
    expect(screen.getByText(/Version:/i)).toBeInTheDocument();
    expect(screen.getByText(device.version)).toBeInTheDocument();
    expect(screen.getByText(/Timezone:/i)).toBeInTheDocument();
    expect(screen.getByText(device.timezone)).toBeInTheDocument();

    // Storage entries
    expect(screen.getByText("sd-1: ok")).toBeInTheDocument();
    expect(screen.getByText("ssd-2: warn")).toBeInTheDocument();

    // Status badges section
    expect(screen.getByText(/Device Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Enabled:/i)).toBeInTheDocument();
    expect(screen.getAllByText("Yes").length).toBeGreaterThan(0); // enabled/connected rows
  });

  test("handles disconnected & disabled state", async () => {
    const user = userEvent.setup();
    const device = makeDevice({ connected: false, enabled: false });
    render(<DeviceCard device={device} />);

    // Top badge shows Disconnected
    expect(screen.getByText(/Disconnected/i)).toBeInTheDocument();

    // Expand to see status rows
    await user.click(screen.getByRole("button"));

    // Both status badges read "No"
    const noBadges = screen.getAllByText(/^No$/i);
    expect(noBadges.length).toBeGreaterThanOrEqual(1);
  });

  test("omits optional fields when not provided", async () => {
    const user = userEvent.setup();
    const device = makeDevice({
      model: undefined,
      version: undefined,
      timezone: undefined,
      storage: [],
    });

    const { queryByText } = render(<DeviceCard device={device} />);

    // Expand
    await user.click(screen.getByRole("button"));

    // These labels should not render without values
    expect(queryByText(/Model:/i)).not.toBeInTheDocument();
    expect(queryByText(/Version:/i)).not.toBeInTheDocument();
    expect(queryByText(/Timezone:/i)).not.toBeInTheDocument();
    expect(queryByText(/Storage:/i)).not.toBeInTheDocument();
  });
});
