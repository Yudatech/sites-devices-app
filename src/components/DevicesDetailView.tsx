import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Site } from "@/types";
import { Badge } from "./ui/badge";
import { DeviceCard } from "./DeviceCard";

interface DeviceDetailsViewProps {
  /** The selected site whose devices should be shown. If null, nothing renders. */
  site: Site | null;
  /** Controls whether the dialog is open (controlled component). */
  open: boolean;
  /** Called when the dialog requests to change its open state. */
  onOpenChange: (open: boolean) => void;
}

/**
 * Modal dialog that lists all devices for a given site.
 * - Renders nothing when `site` is null (guard clause).
 * - Controlled open state via `open` and `onOpenChange`.
 * - Preserves site order and simply maps devices to <DeviceCard>.
 */

export function DevicesDetailView({
  site,
  open,
  onOpenChange,
}: DeviceDetailsViewProps) {
  // Guard: if no site is selected or it has no devices, don’t render the Dialog.
  if (!site || !site.devices) return null;

  // Pre-compute connected count for clarity/readability
  const connectedCount = site.devices.filter((d) => d.connected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="px-6">
          <DialogTitle>{site.title}</DialogTitle>
          <DialogDescription className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0  mt-2">
              Total {site.devices.length} devices
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200 flex-shrink-0  mt-2">
              {connectedCount} connected
            </Badge>
          </DialogDescription>
        </DialogHeader>

        {/* Devices list area */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-auto">
          {site.devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
