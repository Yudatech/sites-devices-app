import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DevicesDetailView } from "@/components/DevicesDetailView";
import type { Device, Site } from "@/types";

function makeDevice(
  overrides: Partial<Device> & Pick<Device, "id" | "site_id" | "title"> = {
    id: 1,
    site_id: 1,
    title: "Device",
  }
): Device {
  return {
    id: overrides.id ?? 1,
    site_id: overrides.site_id ?? 1,
    title: overrides.title ?? "Device",
    description: overrides.description ?? "desc",
    model: overrides.model ?? "M-1",
    version: overrides.version ?? "1.0.0",
    enabled: overrides.enabled ?? true,
    connected: overrides.connected ?? true,
    timezone: overrides.timezone ?? "UTC",
    storage: overrides.storage ?? [],
  };
}

function makeSite(overrides: Partial<Site> = {}): Site {
  return {
    id: overrides.id ?? 100,
    title: overrides.title ?? "Alpha Site",
    owner: overrides.owner ?? "alice",
    devices: overrides.devices ?? [],
  };
}

// ---- Tests ----
describe("<DevicesDetailView />", () => {
  it("renders nothing when site is null", () => {
    const { container } = render(
      <DevicesDetailView site={null} open={false} onOpenChange={() => {}} />
    );
    // Guard clause: component returns null
    expect(container.firstChild).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not render dialog content when open is false", () => {
    const site = makeSite({
      title: "Closed Site",
      devices: [makeDevice({ id: 1, site_id: 1, title: "Temp-1" })],
    });

    render(
      <DevicesDetailView site={site} open={false} onOpenChange={() => {}} />
    );

    // shadcn/radix keeps the dialog mounted but doesn't render DialogContent when closed
    expect(screen.queryByText("Closed Site")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders dialog with title and stats when open is true", () => {
    const site = makeSite({
      title: "Open Site",
      devices: [
        makeDevice({ id: 1, site_id: 1, title: "A", connected: true }),
        makeDevice({ id: 2, site_id: 1, title: "B", connected: false }),
        makeDevice({ id: 3, site_id: 1, title: "C", connected: true }),
      ],
    });

    render(
      <DevicesDetailView site={site} open={true} onOpenChange={() => {}} />
    );

    // Dialog & accessible name (DialogTitle text is used as the dialog name)
    const dialog = screen.getByRole("dialog", { name: /Open Site/i });
    expect(dialog).toBeInTheDocument();

    // Title & badges
    expect(screen.getByText("Open Site")).toBeInTheDocument();
    expect(screen.getByText("Total 3 devices")).toBeInTheDocument();
    expect(screen.getByText("2 connected")).toBeInTheDocument();
  });

  it("renders one DeviceCard per device (by title presence)", () => {
    const site = makeSite({
      title: "Cards Site",
      devices: [
        makeDevice({ id: 10, site_id: 1, title: "Temp-1" }),
        makeDevice({ id: 11, site_id: 1, title: "Temp-2" }),
      ],
    });

    render(
      <DevicesDetailView site={site} open={true} onOpenChange={() => {}} />
    );

    // We don't rely on DeviceCard internals; simply assert device titles appear
    expect(screen.getByText("Temp-1")).toBeInTheDocument();
    expect(screen.getByText("Temp-2")).toBeInTheDocument();
  });

  it("calls onOpenChange when the dialog requests close (Escape key)", async () => {
    // NOTE: This relies on Radix dialog behavior in JSDOM and may vary with versions.
    // If it flakes in your environment, you can omit this test safely.
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const site = makeSite({
      title: "Esc Close",
      devices: [makeDevice({ id: 1, site_id: 1, title: "Only" })],
    });

    render(
      <DevicesDetailView site={site} open={true} onOpenChange={onOpenChange} />
    );

    // Focus the page and send Escape; Radix should call onOpenChange(false)
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalled();
  });
});
