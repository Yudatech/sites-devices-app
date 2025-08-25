import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardHeader } from "@/components/PageHeader"; // adjust path if needed
import type { User } from "@/types";

const makeUser = (over: Partial<User> = {}): User => ({
  id: 1,
  username: "alice",
  password: "12345",
});

describe("<DashboardHeader />", () => {
  it("renders null when user is null", () => {
    const { container } = render(
      <DashboardHeader user={null} logout={() => {}} />
    );
    // Guard: nothing in the DOM
    expect(container.firstChild).toBeNull();
    expect(
      screen.queryByText(/Sites & Devices Management/i)
    ).not.toBeInTheDocument();
  });

  it("renders title, greeting and username when user is present", () => {
    render(<DashboardHeader user={makeUser()} logout={() => {}} />);

    expect(screen.getByText(/Sites & Devices Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();

    // Trigger button displays username
    expect(screen.getByRole("button", { name: /alice/i })).toBeInTheDocument();

    // Menu content is NOT visible until opened
    expect(screen.queryByText(/My Account/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Settings/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sign Out/i)).not.toBeInTheDocument();
  });

  it("opens the dropdown on click and shows menu items", async () => {
    const user = userEvent.setup();
    render(<DashboardHeader user={makeUser()} logout={() => {}} />);

    // Open the menu by clicking the trigger
    await user.click(screen.getByRole("button", { name: /alice/i }));

    // Menu content is portal-rendered; now visible
    expect(await screen.findByText(/My Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();

    // (Accessibility) The popup should be a menu; items are role=menuitem
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems.length).toBeGreaterThanOrEqual(1);
  });

  it("marks Settings as disabled", async () => {
    const user = userEvent.setup();
    render(<DashboardHeader user={makeUser()} logout={() => {}} />);

    await user.click(screen.getByRole("button", { name: /alice/i }));

    const settingsItem = screen.getByRole("menuitem", { name: /settings/i });

    // Radix DropdownMenu sets aria-disabled and/or data-disabled on disabled items
    const isAriaDisabled =
      settingsItem.getAttribute("aria-disabled") === "true";
    const isDataDisabled = settingsItem.hasAttribute("data-disabled");
    expect(isAriaDisabled || isDataDisabled).toBe(true);
  });

  it("calls logout when clicking Sign Out", async () => {
    const user = userEvent.setup();
    const logout = vi.fn();

    render(<DashboardHeader user={makeUser()} logout={logout} />);

    await user.click(screen.getByRole("button", { name: /alice/i }));
    await user.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
