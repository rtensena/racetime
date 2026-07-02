import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function useSchedule(season?: string) {
  return useQuery({
    queryKey: ["schedule", season],
    queryFn: () => api.getSchedule(season),
    // Schedule rarely changes, but we check every 5 minutes
    refetchInterval: 5 * 60 * 1000, 
    staleTime: 60 * 1000,
  });
}

export function useDriverStandings(season?: string) {
  return useQuery({
    queryKey: ["standings", "drivers", season],
    queryFn: () => api.getDriverStandings(season),
    // Live standings updated every 60 seconds
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}

export function useConstructorStandings(season?: string) {
  return useQuery({
    queryKey: ["standings", "constructors", season],
    queryFn: () => api.getConstructorStandings(season),
    // Live standings updated every 60 seconds
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
}
