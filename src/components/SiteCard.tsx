import type { Site } from "@/types";

export default function SiteCard({ site }: { site: Site }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
      <h2 style={{ margin: 0 }}>{site.title}</h2>
    </div>
  );
}
