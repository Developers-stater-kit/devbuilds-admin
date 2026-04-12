"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type BackendState = "checking" | "healthy" | "down";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL;

export function BackendStatus() {
  const [status, setStatus] = useState<BackendState>("checking");
  const [loading, setLoading] = useState(false);

  const checkBackend = async () => {
    try {
      setLoading(true);
      setStatus("checking");

      const res = await fetch(`${BACKEND_URL}/healthcheck`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Backend unavailable");
      }

      const data = await res.json();

      if (data?.message) {
        setStatus("healthy");
      } else {
        setStatus("down");
      }
    } catch (error) {
      setStatus("down");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();

    const interval = setInterval(() => {
      checkBackend();
    }, 30000); // every 30 sec

    return () => clearInterval(interval);
  }, []);

  const statusText =
    status === "healthy"
      ? "Operational"
      : status === "checking"
      ? "Checking"
      : "Disconnected";

  const statusColor = 
    status === "healthy" ? "bg-emerald-500" :
    status === "checking" ? "bg-amber-500" : "bg-destructive";

  const pingColor = 
    status === "healthy" ? "bg-emerald-500/50" :
    status === "checking" ? "bg-amber-500/50" : "bg-destructive/50";

  return (
    <div className="flex items-center gap-2">
      <div className="flex select-none items-center gap-2 rounded-full border bg-card px-3 py-1.5 shadow-sm text-xs font-medium dark:bg-muted/20">
        <div className="relative flex h-2 w-2 items-center justify-center">
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", pingColor)} />
          <span className={cn("relative inline-flex h-2 w-2 rounded-full", statusColor)} />
        </div>
        <span className="text-muted-foreground">{statusText}</span>
      </div>
      
      <button
        onClick={checkBackend}
        disabled={loading}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50 dark:bg-muted/20"
        title="Check backend"
      >
        <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        <span className="sr-only">Refresh status</span>
      </button>
    </div>
  );
}