"use client";

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewMode, EntityBase } from "./types";
import LinkDialog from "./link-dialog";
import UnlinkDialog from "./unlink-dialog";


interface MainCanvasProps {
  viewMode: ViewMode;
  selectedEntity: EntityBase | null;
}

export default function MainCanvas({ viewMode, selectedEntity }: MainCanvasProps) {
  const [data, setData] = useState<EntityBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<EntityBase | null>(null);

  // Refresh linked entities
  const fetchLinkedData = async () => {
    if (!selectedEntity) return;

    setIsLoading(true);
    setError(null);
    setData([]);

    try {
      const endpoint = viewMode === "frameworks"
        ? `/api/admin/link/frameworks/${selectedEntity.uniqueKey}/features`
        : `/api/admin/link/features/${selectedEntity.uniqueKey}/frameworks`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch relations");
      const json = await res.json();

      const items = Array.isArray(json) ? json : json?.data || [];
      setData(items);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkedData();
  }, [selectedEntity, viewMode]);

  // If nothing is selected, show empty placeholder
  if (!selectedEntity) {
    return (
      <div className="flex w-full h-full border-l items-center justify-center p-8 bg-background">
        <div className="text-center flex flex-col items-center max-w-md">
          <LinkIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-medium tracking-tight mb-2 text-foreground">No Selection</h2>
          <p className="text-muted-foreground text-sm">
            Select a {viewMode === "frameworks" ? "framework" : "feature"} from the sidebar to view or manage its relations.
          </p>
        </div>
      </div>
    );
  }

  const oppositeLabel = viewMode === "frameworks" ? "Feature" : "Framework";

  return (
    <div className="flex flex-col w-full h-full bg-background border-l">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-card text-card-foreground">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{selectedEntity.name || selectedEntity.uniqueKey} Relations</h2>
          <p className="text-sm text-muted-foreground">
            Managing linked {oppositeLabel.toLowerCase()}s
          </p>
        </div>
        <Button
          onClick={() => setIsLinkDialogOpen(true)}
          className="gap-2"
          size="sm"
          disabled={selectedEntity.status !== "ACTIVE"} // Prevent linking if source is inactive
        >
          <Plus className="h-4 w-4" />
          Link New {oppositeLabel}
        </Button>
      </div>

      {/* Content Canvas */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        )}

        {!isLoading && error && (
          <div className="p-8 text-center text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        {!isLoading && !error && data.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">No Relations Found</p>
              <Button onClick={() => setIsLinkDialogOpen(true)} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add the first link
              </Button>
            </div>
          </div>
        )}

        {!isLoading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((item) => (
              <Card key={item.id} className="group hover:border-primary/50 transition-colors bg-card overflow-hidden flex flex-col justify-between">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
                  <CardTitle className="text-base font-medium leading-none mt-1">
                    {item.name || item.uniqueKey}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mt-1 -mr-1"
                    onClick={() => setUnlinkTarget(item)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit relation</span>
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <LinkDialog
        open={isLinkDialogOpen}
        onOpenChange={setIsLinkDialogOpen}
        sourceEntity={selectedEntity}
        viewMode={viewMode}
        onSuccess={fetchLinkedData}
      />

      <UnlinkDialog
        open={!!unlinkTarget}
        onOpenChange={(isOpen) => !isOpen && setUnlinkTarget(null)}
        sourceEntity={selectedEntity}
        targetEntity={unlinkTarget}
        viewMode={viewMode}
        onSuccess={() => {
          setUnlinkTarget(null);
          fetchLinkedData();
        }}
      />
    </div>
  );
}
