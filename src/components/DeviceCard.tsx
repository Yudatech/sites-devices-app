import { Device } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Wifi, WifiOff, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export function DeviceCard({ device }: { device: Device }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card className="my-8 p-4 border border-muted/50 hover:border-primary/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-sm font-medium truncate">
              {device.title}
            </CardTitle>
            <CardDescription className="text-xs">
              {device.description} | {device.model}
            </CardDescription>
          </div>
          <div>
            <Badge
              className={`${
                device.connected
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {device.connected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              {device.connected ? "Connected" : "Disconnected"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-transparent hover:bg-primary/10 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CardContent className="space-y-2 w-80">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">
              Specifications
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs bg-muted/30 rounded-lg p-3">
              {device.model && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">{device.model}</span>
                </div>
              )}
              {device.version && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">{device.version}</span>
                </div>
              )}
              {device.timezone && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="font-medium">{device.timezone}</span>
                </div>
              )}
              {device.storage && device.storage.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Storage:</span>
                  {device.storage.map((s) => (
                    <span
                      key={s.id}
                      className="font-medium"
                    >{`${s.id}: ${s.state}`}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-sm font-medium text-foreground">
            Device Status
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Enabled:</span>
              <Badge
                className={`text-xs ${
                  device.enabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {device.enabled ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
              <span className="text-muted-foreground">Connected:</span>
              <Badge
                className={`text-xs ${
                  device.connected
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {device.connected ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
