import type { Site } from "@/types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  MapPin,
  HardDrive,
  Wifi,
  WifiOff,
  Power,
  PowerOff,
} from "lucide-react";
import { Badge } from "./ui/badge";

export default function SiteCard({
  site,
  onViewDevices,
}: {
  site: Site;
  onViewDevices: (site: Site) => void;
}) {
  const { devices, title, id } = site;
  const connectedDevices = devices.filter((d) => d.connected).length;
  const enabledDevices = devices.filter((d) => d.enabled).length;
  const totalDevices = devices.length;
  const notConnectedDevices = devices.filter((device) => !device.connected);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg flex flex-row justify-between">
              <div className="flex gap-2 items-center">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="truncate">{title}</span>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0 ml-2">
                <div className="flex items-center gap-1">
                  <HardDrive className="h-3 w-3" />
                  <span className="capitalize">{devices.length} devices</span>
                </div>
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1 text-sm">
              Site ID: {id}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1">
                {connectedDevices > 0 ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs font-medium">Connected</span>
              </div>
              <div className="ml-auto">
                <span
                  className={`text-sm font-semibold ${
                    connectedDevices > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {connectedDevices}/{totalDevices}
                </span>
              </div>
            </div>

            {/* Enabled Status */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className="flex items-center gap-1">
                {enabledDevices > 0 ? (
                  <Power className="h-4 w-4 text-blue-500" />
                ) : (
                  <PowerOff className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-xs font-medium">Enabled</span>
              </div>
              <div className="ml-auto">
                <span
                  className={`text-sm font-semibold ${
                    enabledDevices > 0 ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {enabledDevices}/{totalDevices}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-p mt-auto">
        {totalDevices > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {notConnectedDevices.length > 0 && (
              <Card className="w-full space-y-3 p-3 bg-pink-50 rounded-lg border border-muted">
                <div className="flex items-center gap-2 mb-2">
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-xs font-medium text-red-600">
                    Not Connected ({notConnectedDevices.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {notConnectedDevices.map((device) => (
                    <Badge
                      key={device.id}
                      variant="outline"
                      className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                    >
                      {device.title}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
            {connectedDevices === totalDevices && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                All Connected
              </Badge>
            )}
            {enabledDevices === totalDevices && (
              <Badge
                variant="secondary"
                className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
              >
                All Enabled
              </Badge>
            )}
            {connectedDevices === 0 && (
              <Badge
                variant="secondary"
                className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              >
                No Connection
              </Badge>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
          variant="outline"
          onClick={() => onViewDevices(site)}
          disabled={totalDevices === 0}
        >
          {totalDevices === 0 ? "No Devices" : "View Devices"}
        </Button>
      </div>
    </Card>
  );
}
