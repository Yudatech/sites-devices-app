import { User, Site } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getSitesByOwner } from "../api/siteService";
import SiteCard from "./SiteCard";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { DevicesDetailView } from "./DevicesDetailView";

export function SitesContent({ user }: { user: User | null }) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDevices = (site: Site) => {
    setSelectedSite(site);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedSite(null);
    }
  };

  if (!user) return null;
  const owner = user.username;
  const {
    data: sites,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["sites", { owner }],
    queryFn: () => getSitesByOwner(owner || ""),
    enabled: !!owner, //only run query if owner is set
    staleTime: Infinity,
  });

  return (
    <div className="p-8 w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Sites Overview
        </h2>
        {!isLoading && sites && sites.length > 0 && (
          <div className="flex gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 flex-shrink-0 ml-2">
              {sites.length} total
            </Badge>
          </div>
        )}
      </div>

      {isLoading && <p>Loading sites…</p>}
      {isError && (
        <p>
          Could not load sites. <Button onClick={() => refetch()}>Retry</Button>
        </p>
      )}
      {sites?.length === 0 && <p>No sites for this user.</p>}
      {sites && sites?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites?.map((site) => (
            <SiteCard
              key={site.id}
              site={site}
              onViewDevices={() => handleViewDevices(site)}
            />
          ))}
        </div>
      )}
      {selectedSite && (
        <DevicesDetailView
          site={selectedSite}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
        />
      )}
    </div>
  );
}
