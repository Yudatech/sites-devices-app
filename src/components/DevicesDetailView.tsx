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
  site: Site | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DevicesDetailView({
  site,
  open,
  onOpenChange,
}: DeviceDetailsViewProps) {
  if (!site) return null;
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
              {site.devices.filter((d) => d.connected).length} connected
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 scrollbar-auto">
          {site.devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
