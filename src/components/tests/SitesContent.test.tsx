import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// SUT
import { SitesContent } from "../SitesContent";

// ---- Mocks ----
const getSitesByOwner = vi.fn();
vi.mock("../../api/siteService", () => ({
  getSitesByOwner: (...args: any[]) => getSitesByOwner(...args),
}));

// Make SiteCard minimal: shows title + a button that calls onViewDevices(site)
vi.mock("../SiteCard", () => ({
  __esModule: true,
  default: ({ site, onViewDevices }: any) => (
    <div data-testid={`site-${site.id}`}>
      <span>{site.title}</span>
      <button onClick={() => onViewDevices(site)}>View Devices</button>
    </div>
  ),
}));

// Make DevicesDetailView minimal: render only when open=true
vi.mock("../DevicesDetailView", () => ({
  __esModule: true,
  DevicesDetailView: ({ site, open }: any) =>
    open ? (
      <div data-testid="devices-dialog">Devices for: {site.title}</div>
    ) : null,
}));

// ---- Helpers ----
function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // keep tests deterministic
      },
    },
  });
}

function renderWithClient(ui: React.ReactElement) {
  const client = createClient();
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

// Minimal types/fixtures
type Device = {
  id: number;
  siteId: number;
  title: string;
  enabled: boolean;
  connected: boolean;
};
type Site = {
  id: number;
  title: string;
  owner: string;
  devices?: Device[];
};
const user = { id: 1, username: "demouser1", email: "x@y.z" } as any;

const mkDevice = (id: number, overrides: Partial<Device> = {}): Device => ({
  id,
  siteId: 1,
  title: `Device ${id}`,
  enabled: true,
  connected: true,
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SitesContent", () => {
  it("renders nothing when user is null", () => {
    renderWithClient(<SitesContent user={null} />);
    expect(screen.queryByText(/Sites Overview/i)).not.toBeInTheDocument();
  });

  it("shows loading then empty state when no sites", async () => {
    getSitesByOwner.mockResolvedValueOnce([] as Site[]);
    renderWithClient(<SitesContent user={user} />);

    expect(screen.getByText(/Loading sites…/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/No sites for this user/i)
    ).toBeInTheDocument();
  });

  it("shows error and allows retry", async () => {
    getSitesByOwner
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce([
        { id: 1, title: "Site A", owner: "demouser1", devices: [] },
      ] as Site[]);

    renderWithClient(<SitesContent user={user} />);

    // Error state appears
    const errText = await screen.findByText(/Could not load sites/i);
    expect(errText).toBeInTheDocument();

    // Click retry -> loads sites
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));
    expect(await screen.findByText("Site A")).toBeInTheDocument();
  });

  it("renders sites grid and count badge", async () => {
    const sites: Site[] = [
      { id: 1, title: "Site A", owner: "demouser1", devices: [] },
      { id: 2, title: "Site B", owner: "demouser1", devices: [] },
    ];
    getSitesByOwner.mockResolvedValueOnce(sites);

    renderWithClient(<SitesContent user={user} />);

    expect(await screen.findByText("Site A")).toBeInTheDocument();
    expect(screen.getByText("Site B")).toBeInTheDocument();
    // Count badge
    expect(screen.getByText(/2 total/i)).toBeInTheDocument();
  });

  it("opens dialog when viewing a site that has devices; does not open for empty devices", async () => {
    const sites: Site[] = [
      {
        id: 1,
        title: "With Devices",
        owner: "demouser1",
        devices: [mkDevice(1), mkDevice(2, { connected: false })],
      },
      { id: 2, title: "No Devices", owner: "demouser1", devices: [] },
    ];
    getSitesByOwner.mockResolvedValueOnce(sites);

    renderWithClient(<SitesContent user={user} />);

    // Wait for sites
    await screen.findByText("With Devices");

    // Click "View Devices" on site with devices -> dialog appears
    fireEvent.click(screen.getAllByText(/View Devices/i)[0]);
    expect(await screen.findByTestId("devices-dialog")).toHaveTextContent(
      "With Devices"
    );

    // Close by toggling open=false through the component API (simulate onOpenChange)
    // Our mock dialog doesn't expose a close button; instead, trigger by "viewing" empty site.
    fireEvent.click(screen.getAllByText(/View Devices/i)[1]);
    // Since the second site has no devices, dialog should not be present
    await waitFor(() =>
      expect(screen.queryByTestId("devices-dialog")).not.toBeInTheDocument()
    );
  });
});
