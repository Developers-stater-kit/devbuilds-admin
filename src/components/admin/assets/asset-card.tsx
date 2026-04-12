"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, ExternalLink, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DeleteAssetDialog } from "./asset-dialog";

interface AssetCardProps {
  name: string;
  publicUrl: string;
  path: string;
  onDelete: (path: string) => Promise<void>;
}

export function AssetCard({ name, publicUrl, path, onDelete }: AssetCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      toast.success("Link copied");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(path);
      // Success toast is usually handled in the parent page.tsx
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden group border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 flex flex-col h-full">
      {/* Image Preview Section */}
      <CardContent className="p-0 relative aspect-video bg-zinc-950 flex items-center justify-center overflow-hidden border-b border-zinc-800">
        <Image
          src={publicUrl}
          alt={name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-9 w-9"
                  onClick={() => window.open(publicUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open Original</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>

      {/* Details Section */}
      <CardFooter className="p-3 flex flex-col gap-3 mt-auto">
        <p className="text-xs font-medium text-zinc-300 truncate w-full" title={name}>
          {name}
        </p>

        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-center px-2 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 w-full">
              <span className="truncate block">{publicUrl}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    onClick={handleCopy}
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy URL</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                {/* DeleteAssetDialog acts as the Trigger */}
                <DeleteAssetDialog
                  name={name}
                  onConfirm={handleDelete}
                  isDeleting={isDeleting}
                />
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}