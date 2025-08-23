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

export function DashboardHeader({
  user,
  logout,
}: {
  user: UserProps | null;
  logout: () => void;
}) {
  if (!user) return null;

  return (
    <div className="border-b bg-gray-100 w-full px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Sites & Devices Management
          </h1>
          <p className="text-sm text-foreground/70">
            Monitor and manage your sites and devices efficiently
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">Welcome back!</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                <User className="h-4 w-4" />
                {user.username}
              </Button>
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
                className="text-red-600 focus:text-red-600"
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
