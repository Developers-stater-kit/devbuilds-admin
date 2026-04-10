"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { Component, FileCode, Layers, Loader2 } from "lucide-react";

interface Stats {
  frameworksCount: number;
  featuresCount: number;
  templatesCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    frameworksCount: 0,
    featuresCount: 0,
    templatesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const { isPending } = useSession();

  useEffect(() => {
    let isMounted = true;
    
    async function fetchStats() {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/stats");
        const res = await response.json();

        if (isMounted) {
          setStats({
            frameworksCount: res?.data?.frameworks || 0,
            featuresCount: res?.data?.features || 0,
            templatesCount: res?.data?.templates || 0,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  if (isPending || (loading && stats.frameworksCount === 0)) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Frameworks</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.frameworksCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active architectures and environments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Component className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuresCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available integrations and tools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templatesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pre-configured starter kits
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}