import { useQuery } from "@tanstack/react-query";
import { featureFlags } from "../config/featureFlags";
import { payloadClient } from "../api/clients/payloadClient";

export type BlogAvailability = "available" | "checking" | "unavailable";

// Shared across the nav link, the homepage teaser, and the /blog routes so
// they all agree on whether the blog should be visible right now. The query
// itself is cached/deduped by react-query, so this only ever makes one
// network request regardless of how many components call the hook.
export const useBlogAvailability = (): BlogAvailability => {
  const { data: isHealthy, isLoading } = useQuery({
    queryKey: ["cms-health"],
    queryFn: () => payloadClient.checkHealth(),
    enabled: featureFlags.showBlog,
    retry: false,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  if (!featureFlags.showBlog) return "unavailable";
  if (isLoading) return "checking";
  return isHealthy ? "available" : "unavailable";
};
