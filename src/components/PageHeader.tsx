import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as UserProps } from "@/types";
import { LogOut, User, Settings } from "lucide-react";
import { Button } from "./ui/button";

/**
 * Dashboard header with title + user menu.
 * Uses shadcn/ui DropdownMenu (Radix under the hood).
 * - Returns null if no user (keeps render tree clean).
 * - Menu content is portal-rendered and only present after opening.
 */

export function DashboardHeader({
  user,
  logout,
}: {
  user: UserProps | null;
  logout: () => void;
}) {
  // Guard clause: when logged out, header is not rendered at all.
  if (!user) return null;

  return (
    <div className="border-b bg-gray-100 w-full px-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Sites & Devices Management
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Welcome back!</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 border bg-transparent shadow-md hover:bg-primary p-2 rounded-lg cursor-pointer
                focus-visible:border-ring"
                aria-haspopup="menu"
                data-testid="user-menu-trigger"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                {user.username}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
