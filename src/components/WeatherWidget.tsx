import { useTranslation } from "react-i18next";
import { FiHome, FiThermometer, FiDroplet, FiSun, FiCloud, FiBattery } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDeviceStatus } from "../api/clients/smartHomeClient";
import { useState, useEffect, useMemo } from "react";
import WeatherChart from "./WeatherChart";
import type { WeatherDataPoint } from "./WeatherChart";

const generateDummyHistory = (): WeatherDataPoint[] => {
  const now = new Date();
  return Array.from({ length: 24 }, (_, i) => {
    const hoursAgo = 23 - i;
    const d = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    const hour = d.getHours().toString().padStart(2, "0") + ":00";
    const baseTemp = 21;
    const tempVariance = Math.sin((i / 24) * 2 * Math.PI - Math.PI / 2) * 3;
    const temp = parseFloat(
      (baseTemp + tempVariance + (Math.random() - 0.5)).toFixed(1)
    );
    const humidity = Math.round(
      55 + Math.cos((i / 24) * 2 * Math.PI) * 10 + (Math.random() - 0.5) * 5
    );
    return { hour, temp, humidity };
  });
};

const WeatherWidget = () => {
  const { data, isLoading } = useDeviceStatus();
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const historyData = useMemo(() => generateDummyHistory(), []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rawTemp = data?.result.find((r) => r.code === "va_temperature")?.value as number | undefined;
  const rawHumidity = data?.result.find((r) => r.code === "va_humidity")?.value as number | undefined;
  const rawBattery = data?.result.find((r) => r.code === "battery_percentage")?.value as number | undefined;

  const temp = rawTemp !== undefined ? rawTemp / 10 : undefined;
  const humidity = rawHumidity !== undefined ? rawHumidity : undefined;
  const battery = rawBattery !== undefined ? rawBattery : undefined;

  const displayTemp = temp !== undefined ? `${temp.toFixed(1)}°C` : isLoading ? "..." : "--";
  const displayHumidity = humidity !== undefined ? `${humidity}%` : isLoading ? "..." : "--";
  const displayBattery = battery !== undefined ? `${battery}%` : isLoading ? "..." : "--";

  const getTempColor = () => {
    if (temp === undefined) return "text-gray-400";
    if (temp >= 25) return "text-red-400";
    if (temp >= 18) return "text-yellow-400";
    return "text-blue-400";
  };

  const getBatteryColor = () => {
    if (battery === undefined) return "text-gray-400";
    if (battery <= 20) return "text-red-400";
    if (battery <= 50) return "text-yellow-400";
    return "text-green-400";
  };

  const renderTempIcon = () => {
    if (temp !== undefined) {
      if (temp >= 25) return <FiSun className={`w-5 h-5 ${getTempColor()}`} />;
      if (temp <= 18) return <FiCloud className={`w-5 h-5 ${getTempColor()}`} />;
    }
    return <FiThermometer className={`w-5 h-5 ${getTempColor()}`} />;
  };

  const handleMouseEnter = () => { if (!isMobile) setShowChart(true); };
  const handleMouseLeave = () => { if (!isMobile) setShowChart(false); };
  const handleClick = () => {
    if (isMobile) {
      if (isExpanded && showChart) {
        setShowChart(false);
        setIsExpanded(false);
      } else if (isExpanded) {
        setShowChart(true);
      } else {
        setIsExpanded(true);
      }
    }
  };

  return (
    rawTemp !== undefined && rawHumidity !== undefined && (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-8 left-8 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence>
            {showChart && (
              <motion.div
                key="chart-panel"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="mb-2 bg-[#151030] border border-white/10 text-white rounded-lg shadow-xl p-3"
                style={{ width: 340 }}
              >
                <WeatherChart data={historyData} lastMeasurementAt={data?.t} />
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="flex items-center gap-3 bg-[#151030] text-white rounded-lg shadow-lg p-3 cursor-pointer select-none"
            onClick={handleClick}
          >
            <span title={t('weather.homeTooltip')}>
              <FiHome className="w-6 h-6" />
            </span>
            
            {(!isMobile || isExpanded) && (
              <motion.div 
                initial={isMobile ? { opacity: 0, width: 0 } : false}
                animate={isMobile ? { opacity: 1, width: "auto" } : {}}
                exit={isMobile ? { opacity: 0, width: 0 } : {}}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="flex items-center gap-1" title={t('weather.tempTooltip')}>
                  {renderTempIcon()}
                  <span className="font-semibold">{displayTemp}</span>
                </div>
                <div className="flex items-center gap-1" title={t('weather.humidityTooltip')}>
                  <FiDroplet className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold">{displayHumidity}</span>
                </div>
                <div className="flex items-center gap-1" title={t('weather.batteryTooltip')}>
                  <FiBattery className={`w-5 h-5 ${getBatteryColor()}`} />
                  <span className="font-semibold">{displayBattery}</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  );
};

export default WeatherWidget;
