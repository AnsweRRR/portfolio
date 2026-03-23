import { useTranslation } from "react-i18next";
import { FiThermometer, FiDroplet } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";

export interface WeatherDataPoint {
  hour: string;
  temp: number;
  humidity: number;
}

interface WeatherChartProps {
  data: WeatherDataPoint[];
  lastMeasurementAt?: number;
}

interface WeatherChartLegendProps {
  lastMeasurementLabel: string;
}

const WeatherChartLegend = ({ lastMeasurementLabel }: WeatherChartLegendProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-1 pt-1 text-[11px] text-gray-200">
      <div className="flex items-start justify-center gap-6">
        <div className="flex items-center gap-1.5">
          <FiThermometer className="h-3.5 w-3.5 text-yellow-400" />
          <span>{t("weather.chartTemp")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FiDroplet className="h-3.5 w-3.5 text-blue-300" />
          <span>{t("weather.chartHumidity")}</span>
        </div>
      </div>
      <span className="text-[10px] text-gray-400">{lastMeasurementLabel}</span>
    </div>
  );
};

const WeatherChart = ({ data, lastMeasurementAt }: WeatherChartProps) => {
  const { t, i18n } = useTranslation();
  const formattedMeasurementDate = lastMeasurementAt
    ? new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(lastMeasurementAt))
    : "--";
  const lastMeasurementLabel = `${t("weather.lastMeasurement")} ${formattedMeasurementDate}`;

  return (
    <>
      <p className="text-xs text-gray-400 mb-2 font-medium tracking-wide uppercase">
        {t("weather.chartTitle")}
      </p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis
            dataKey="hour"
            tick={{ fill: "#9ca3af", fontSize: 10 }}
            tickLine={false}
            interval={3}
          />
          <YAxis
            yAxisId="temp"
            domain={["auto", "auto"]}
            tick={{ fill: "#fbbf24", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            width={40}
          />
          <YAxis
            yAxisId="humidity"
            orientation="right"
            domain={["auto", "auto"]}
            tick={{ fill: "#93c5fd", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0d0b20",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e5e7eb" }}
          />
          <Legend content={<WeatherChartLegend lastMeasurementLabel={lastMeasurementLabel} />} />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temp"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="#93c5fd"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default WeatherChart;
