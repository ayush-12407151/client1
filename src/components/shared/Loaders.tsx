"use client";

import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

/** Full-page animated loader for data-fetching states */
export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 select-none">
      {/* Orbital ring animation */}
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600"
          style={{ animation: "spin 0.9s linear infinite" }}
        />
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-5 h-5 bg-indigo-500 rounded-full"
            style={{ animation: "pulse-scale 1.2s ease-in-out infinite" }}
          />
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-600 font-semibold text-base">{message}</p>
        {/* Dot-trail loading text */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{
                animation: "bounce-dot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.6); opacity: 0.5; }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/** Skeleton card shimmer for table/list loading */
export function SkeletonRow({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-slate-200 rounded-full" style={{ width: i === 0 ? "60%" : "80%" }} />
        </td>
      ))}
    </tr>
  );
}

/** Skeleton card shimmer for card-grid loading */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded-full w-2/3" />
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        </div>
      </div>
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="h-3 bg-slate-100 rounded-full w-4/5" />
    </div>
  );
}

/** Overlay spinner for action buttons / form submissions */
export function FullScreenOverlay({ message = "Please wait..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9998] bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-violet-500"
          style={{ animation: "spin 0.8s linear infinite" }}
        />
      </div>
      <p className="text-slate-700 font-semibold text-sm">{message}</p>
    </div>
  );
}
