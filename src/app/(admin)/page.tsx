import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchBackend } from "@/lib/api";
import { ArrowRight, Component, FileCode, Layers } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    // Calling the proxy route you just created
    const res = await fetchBackend("/api/admin/stats");
    return {
      frameworksCount: res?.data?.frameworks || 0,
      featuresCount: res?.data?.features || 0,
      templatesCount: res?.data?.templates || 0,
    };
  } catch (error) {
    return { frameworksCount: 0, featuresCount: 0, templatesCount: 0 };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

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