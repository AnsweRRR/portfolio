import { useEffect, useState } from "react";
import { navLinks } from "../api/navlink";

export default function MacOSMenuBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full backdrop-blur-xl bg-slate-900/70 border-b border-white/10 px-4 py-1 flex items-center text-sm text-slate-200 select-none">
      <div className="flex items-center gap-2 mr-4">
        <svg
          viewBox="0 0 16 16"
          className="w-4 h-4 fill-slate-200"
          aria-hidden
        >
          <path d="M11.2 8.3c0-1.2.6-2.2 1.6-2.9-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2.1 1 0 1.4-.6 2.7-.6 1.2 0 1.6.6 2.7.6 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.2-.1 0-2.6-1-2.6-3.5z" />
          <path d="M9.6 2.2c.6-.8 1-1.9.9-3-1 .1-2.1.7-2.7 1.5-.6.7-1.1 1.8-.9 2.9 1 .1 2-.6 2.7-1.4z" />
        </svg>
      </div>

      <div className="flex gap-4 font-medium">
        {navLinks.map((nav) => (
          <span key={nav.id} className="hover:text-white cursor-default">{nav.title}</span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-3 text-slate-300">
        <span className="text-xs">🔋 82%</span>
        <span className="text-xs">⌨️</span>
        <span className="text-xs font-medium">{time}</span>
      </div>
    </div>
  );
}
