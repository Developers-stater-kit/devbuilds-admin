"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AssetCard } from "@/components/admin/assets/asset-card";
import { UploadButton } from "@/components/admin/assets/upload-button";
import { listAssets, deleteImage } from "@/lib/upload-assets";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Asset {
  name: string;
  publicUrl: string;
  path: string;
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    const { assets, error } = await listAssets();

    if (error) {
      toast.error(`Failed to load assets: ${error}`);
    } else {
      setAssets(assets as Asset[]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleDelete = async (path: string) => {
    try {
      const { error } = await deleteImage(path);
      if (error) throw new Error(error);

      setAssets((prev) => prev.filter((asset) => asset.path !== path));
      toast.success("Asset deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-background">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Website Assets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload, manage and organize your assets
          </p>
        </div>

        <UploadButton onUploadSuccess={fetchAssets} />
      </div>

      {/* Content */}
      <div className="rounded-2xl border bg-card p-4 md:p-6">
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))
          ) : assets.length > 0 ? (
            assets.map((asset) => (
              <AssetCard
                key={asset.path}
                name={asset.name}
                publicUrl={asset.publicUrl}
                path={asset.path}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 border border-dashed rounded-xl">
              <p className="text-sm font-medium text-muted-foreground">
                No assets found
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your first file to get started
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}