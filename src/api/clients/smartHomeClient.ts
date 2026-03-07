import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_PROXY = import.meta.env.VITE_TUYA_USE_PROXY === 'true';
interface ApiResult {
  code: string;
  value: string | number | boolean;
}
interface ApiResponse {
  result: ApiResult[];
  success: boolean;
  t: number;
  tid: string;
}

type DeviceStatus = ApiResponse;

async function fetchDeviceStatus(): Promise<DeviceStatus> {
  // Determine the base URL for the API request
  let baseUrl = '';
  
  if (USE_PROXY || !API_BASE_URL || API_BASE_URL === 'undefined') {
    // Use relative URL (works for both local dev proxy and Vercel deployments)
    baseUrl = '';
  } else {
    // Use the configured API_BASE_URL for production
    baseUrl = API_BASE_URL;
  }
  
  const url = `${baseUrl}/api/tuya/status`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch device status: ${res.status}`);
  }
  return res.json();
}

import type { UseQueryOptions } from '@tanstack/react-query';

export function useDeviceStatus(
  options?: UseQueryOptions<DeviceStatus, Error>,
) {
  return useQuery<DeviceStatus, Error>({
    queryKey: ['deviceStatus'],
    queryFn: fetchDeviceStatus,
    staleTime: Infinity,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export { fetchDeviceStatus };