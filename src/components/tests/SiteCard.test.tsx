import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SiteCard from "../SiteCard";
import type { Site } from "@/types";
import { makeDevice } from "./utils";

describe("SiteCard", () => {
  it("shows title, site id, connected/enabled stats and not-connected list", () => {
    const site: Site = {
      id: 1,
      title: "Mixed Site",
      owner: "demouser1" as any,
      devices: [
        makeDevice({ id: 1, title: "Cam 1", connected: true, enabled: true }),
        makeDevice({ id: 2, title: "Cam 2", connected: false, enabled: true }),
        makeDevice({ id: 3, title: "Cam 3", connected: true, enabled: false }),
      ],
    };

    render(<SiteCard site={site} onViewDevices={() => {}} />);

    expect(screen.getByText("Mixed Site")).toBeInTheDocument();
    expect(screen.getByText(/Site ID:\s*1/i)).toBeInTheDocument();
    // Connected 2/3, Enabled 2/3
    expect(screen.getByText("Connected")).toBeInTheDocument();
    expect(screen.getAllByText(/2\s*\/\s*3/)).toHaveLength(2);
    expect(screen.getByText("Enabled")).toBeInTheDocument();

    // Not connected section lists the right device
    expect(screen.getByText(/Not Connected \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText("Cam 2")).toBeInTheDocument();

    // Summary badges should NOT show "All Connected" or "All Enabled" here
    expect(screen.queryByText(/All Connected/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/All Enabled/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/No Connection/i)).not.toBeInTheDocument();
  });

  it("shows 'All Connected' and 'All Enabled' when all devices are connected/enabled", () => {
    const site: Site = {
      id: 2,
      title: "All Good Site",
      owner: "demouser1" as any,
      devices: [
        makeDevice({ id: 1, title: "Cam 1", connected: true, enabled: true }),
        makeDevice({ id: 2, title: "Cam 2", connected: true, enabled: true }),
      ],
    };

    render(<SiteCard site={site} onViewDevices={() => {}} />);

    expect(screen.getByText(/All Connected/i)).toBeInTheDocument();
    expect(screen.getByText(/All Enabled/i)).toBeInTheDocument();
    expect(screen.queryByText(/Not Connected/i)).not.toBeInTheDocument();
  });

  it("shows 'No Connection' badge when none are connected", () => {
    const site: Site = {
      id: 3,
      title: "Down Site",
      owner: "demouser1" as any,
      devices: [
        makeDevice({ id: 1, title: "Cam 1", connected: false, enabled: true }),
        makeDevice({ id: 2, title: "Cam 2", connected: false, enabled: false }),
      ],
    };

    render(<SiteCard site={site} onViewDevices={() => {}} />);

    expect(screen.getByText(/No Connection/i)).toBeInTheDocument();
    // Not Connected (2) list present and shows device names
    expect(screen.getByText(/Not Connected \(2\)/i)).toBeInTheDocument();
    expect(screen.getByText("Cam 1")).toBeInTheDocument();
    expect(screen.getByText("Cam 2")).toBeInTheDocument();
  });

  it("disables the action button when there are no devices", () => {
    const site: Site = {
      id: 4,
      title: "Empty Site",
      owner: "demouser1" as any,
      devices: [],
    };

    render(<SiteCard site={site} onViewDevices={() => {}} />);

    const btn = screen.getByRole("button", { name: /No Devices/i });
    expect(btn).toBeDisabled();
  });

  it("calls onViewDevices(site) when clicking the action button", () => {
    const site: Site = {
      id: 5,
      title: "Clickable Site",
      owner: "demouser1" as any,
      devices: [
        makeDevice({ id: 1, title: "Cam 1", connected: true, enabled: true }),
      ],
    };

    const onViewDevices = vi.fn();
    render(<SiteCard site={site} onViewDevices={onViewDevices} />);

    const btn = screen.getByRole("button", { name: /View Devices/i });
    fireEvent.click(btn);
    expect(onViewDevices).toHaveBeenCalledTimes(1);
    expect(onViewDevices).toHaveBeenCalledWith(site);
  });
});
