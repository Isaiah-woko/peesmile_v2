"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      setNow(
        new Date().toLocaleTimeString("en", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="mono-label text-body-small text-ash tabular-nums">
      {now || "--:--:--"}
    </span>
  );
}