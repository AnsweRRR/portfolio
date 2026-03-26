import { useQueries } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const USE_PROXY = import.meta.env.VITE_TUYA_USE_PROXY === 'true';

function apiOrigin(): string {
  if (USE_PROXY || !API_BASE_URL || API_BASE_URL === 'undefined') {
    return '';
  }
  return API_BASE_URL;
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

export interface WeatherHistorySample {
  time: number;
  value: number;
}

export interface WeatherHistoryResponse {
  temperature: WeatherHistorySample[];
  humidity: WeatherHistorySample[];
}

async function fetchDeviceStatus(): Promise<DeviceStatus> {
  const url = `${apiOrigin()}/api/tuya/status`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch device status: ${res.status}`);
  }
  return res.json();
}

async function fetchWeatherHistory(): Promise<WeatherHistoryResponse> {
  const url = `${apiOrigin()}/api/weather/history`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather history: ${res.status}`);
  }
  return res.json();
}

export function useDeviceStatus(
  options?: UseQueryOptions<DeviceStatus, Error>,
) {
  const [statusQuery, historyQuery] = useQueries({
    queries: [
      {
        queryKey: ['deviceStatus'],
        queryFn: fetchDeviceStatus,
        staleTime: Infinity,
        refetchInterval: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...options,
      },
      {
        queryKey: ['weatherHistory'],
        queryFn: fetchWeatherHistory,
        staleTime: 60_000,
        refetchInterval: 120_000,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
      },
    ],
  });

  return {
    data: statusQuery.data,
    weatherHistory: historyQuery.data,
    isLoading: statusQuery.isLoading,
    isHistoryLoading: historyQuery.isLoading,
  };
}

export { fetchDeviceStatus, fetchWeatherHistory };