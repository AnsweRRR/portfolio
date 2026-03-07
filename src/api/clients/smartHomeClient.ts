import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const USE_PROXY = import.meta.env.VITE_TUYA_USE_PROXY === 'true';

if (!API_BASE_URL) {
  console.warn('smartHomeClient: missing VITE_API_BASE_URL environment variable');
}
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
  const url = `${USE_PROXY ? '/api' : `${API_BASE_URL}/api`}/tuya/status`;
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