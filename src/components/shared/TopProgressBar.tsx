"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // New route — start bar
    setProgress(0);
    setVisible(true);

    // Animate to 90% quickly
    const steps = [15, 35, 55, 70, 85, 92];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
        timerRef.current = setTimeout(tick, 150 + i * 60);
      }
    };
    timerRef.current = setTimeout(tick, 50);

    // After a short delay, complete the bar
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 400);
    }, 700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full transition-all ease-out"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
          boxShadow: "0 0 10px rgba(99,102,241,0.7), 0 0 20px rgba(139,92,246,0.4)",
          transition: progress === 100 ? "width 0.3s ease-out, opacity 0.4s ease" : "width 0.4s ease-out",
          opacity: progress === 100 ? 0 : 1,
          borderRadius: "0 4px 4px 0",
        }}
      />
      {/* Glow dot at the end */}
      <div
        className="absolute top-0 h-[3px] w-8 rounded-full"
        style={{
          left: `calc(${progress}% - 32px)`,
          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(139,92,246,0.6) 100%)",
          filter: "blur(2px)",
          transition: "left 0.4s ease-out",
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
