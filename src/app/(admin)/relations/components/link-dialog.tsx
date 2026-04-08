"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EntityBase, ViewMode } from "./types";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceEntity: EntityBase | null;
  viewMode: ViewMode;
  onSuccess: () => void;
}

export default function LinkDialog({
  open,
  onOpenChange,
  sourceEntity,
  viewMode,
  onSuccess
}: LinkDialogProps) {
  const [isLinking, setIsLinking] = useState(false);
  const [frameworks, setFrameworks] = useState<EntityBase[]>([]);
  const [features, setFeatures] = useState<EntityBase[]>([]);

  const [selectedFramework, setSelectedFramework] = useState<EntityBase | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<EntityBase | null>(null);

  const [openFrameworkCombo, setOpenFrameworkCombo] = useState(false);
  const [openFeatureCombo, setOpenFeatureCombo] = useState(false);

  // Fetch all choices whenever the dialog opens so the user can pick
  useEffect(() => {
    if (open) {
      // Preselect the current entity
      if (viewMode === "frameworks" && sourceEntity) {
        setSelectedFramework(sourceEntity);
        setSelectedFeature(null);
      } else if (viewMode === "features" && sourceEntity) {
        setSelectedFeature(sourceEntity);
        setSelectedFramework(null);
      } else {
        setSelectedFramework(null);
        setSelectedFeature(null);
      }

      const fetchAll = async () => {
        try {
          const [fwRes, ftRes] = await Promise.all([
            fetch("/api/admin/frameworks"),
            fetch("/api/admin/features")
          ]);

          if (fwRes.ok) {
            const fwJson = await fwRes.json();
            const rawFw = Array.isArray(fwJson) ? fwJson : fwJson.data || [];
            // Only allow linking ACTIVE frameworks
            setFrameworks(rawFw.filter((f: EntityBase) => f.status === "ACTIVE"));
          }
          if (ftRes.ok) {
            const ftJson = await ftRes.json();
            const rawFt = Array.isArray(ftJson) ? ftJson : ftJson.data || [];
            // Only allow linking ACTIVE features
            setFeatures(rawFt.filter((f: EntityBase) => f.status === "ACTIVE"));
          }
        } catch (error) {
          console.error("Failed to load options", error);
        }
      };

      fetchAll();
    }
  }, [open, sourceEntity, viewMode]);

  const handleLink = async () => {
    if (!selectedFramework || !selectedFeature) {
      toast.error("Please select both a framework and a feature.");
      return;
    }

    setIsLinking(true);
    try {
      const res = await fetch(`/api/admin/link/${selectedFramework.uniqueKey}/${selectedFeature.uniqueKey}`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to create relation");
      }

      toast.success("Relation linked successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while linking.");
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-visible">
        <DialogHeader>
          <DialogTitle>Link New Relation</DialogTitle>
          <DialogDescription>
            Select a Framework and a Feature to link them together.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label>Framework</Label>
            <Popover open={openFrameworkCombo} onOpenChange={setOpenFrameworkCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openFrameworkCombo}
                  className="w-full justify-between font-normal"
                >
                  {selectedFramework ? selectedFramework.name || selectedFramework.uniqueKey : "Select framework..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[380px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search framework..." />
                  <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((fw) => (
                        <CommandItem
                          key={fw.id}
                          value={fw.name || fw.uniqueKey}
                          onSelect={() => {
                            setSelectedFramework(fw);
                            setOpenFrameworkCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFramework?.id === fw.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {fw.name || fw.uniqueKey}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Feature</Label>
            <Popover open={openFeatureCombo} onOpenChange={setOpenFeatureCombo}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openFeatureCombo}
                  className="w-full justify-between font-normal"
                >
                  {selectedFeature ? selectedFeature.name || selectedFeature.uniqueKey : "Select feature..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[380px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search feature..." />
                  <CommandList>
                    <CommandEmpty>No feature found.</CommandEmpty>
                    <CommandGroup>
                      {features.map((ft) => (
                        <CommandItem
                          key={ft.id}
                          value={ft.name || ft.uniqueKey}
                          onSelect={() => {
                            setSelectedFeature(ft);
                            setOpenFeatureCombo(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFeature?.id === ft.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {ft.name || ft.uniqueKey}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLinking}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={!selectedFramework || !selectedFeature || isLinking}>
            {isLinking ? "Linking..." : "Link Entities"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
