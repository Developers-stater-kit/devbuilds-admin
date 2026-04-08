"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EntityBase, ViewMode } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Using sonner for toasts as specified in package.json

interface UnlinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceEntity: EntityBase | null;
  targetEntity: EntityBase | null;
  viewMode: ViewMode;
  onSuccess: () => void;
}

export default function UnlinkDialog({
  open,
  onOpenChange,
  sourceEntity,
  targetEntity,
  viewMode,
  onSuccess
}: UnlinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!sourceEntity || !targetEntity) return null;

  // Make it consistent by knowing which is framework and which is feature to construct the URL
  const frameworkKey = viewMode === "frameworks" ? sourceEntity.uniqueKey : targetEntity.uniqueKey;
  const featureKey = viewMode === "features" ? sourceEntity.uniqueKey : targetEntity.uniqueKey;

  const frameworkName = viewMode === "frameworks" ? sourceEntity.name : targetEntity.name;
  const featureName = viewMode === "features" ? sourceEntity.name : targetEntity.name;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/link/${frameworkKey}/${featureKey}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to remove relation");
      }

      toast.success("Relation removed successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while unlinking.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove Relation</DialogTitle>
          <DialogDescription>
            Are you sure you want to unlink this framework and feature?
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="framework">Framework Name</Label>
            <Input id="framework" readOnly value={frameworkName || frameworkKey || ""} className="bg-muted" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feature">Feature Name</Label>
            <Input id="feature" readOnly value={featureName || featureKey || ""} className="bg-muted" />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
