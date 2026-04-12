"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewMode, EntityBase } from "./types";
import { cn } from "@/lib/utils";
import { getAllFrameworks } from "../../frameworks/action";
import { getAllFeatures } from "../../features/action";

interface SidebarListProps {
  viewMode: ViewMode;
  onTabChange: (val: string) => void;
  selectedEntity: EntityBase | null;
  onSelect: (entity: EntityBase) => void;
}

export default function SidebarList({
  viewMode,
  onTabChange,
  selectedEntity,
  onSelect,
}: SidebarListProps) {
  const [data, setData] = useState<EntityBase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function loadList() {
      setIsLoading(true);
      setError(null);
      try {
        let res;
        if (viewMode === "frameworks") {
          res = await getAllFrameworks();
        } else {
          res = await getAllFeatures();
        }

        if (!res.success) throw new Error(res.error || "Failed to fetch");
        
        const items = res.data || [];
        // Filter to only show ACTIVE entities
        const activeItems = items.filter((item: EntityBase) => item.status === "ACTIVE");
        if (active) setData(activeItems);
      } catch (err: any) {
        if (active) setError(err.message || "An error occurred");
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadList();
    return () => {
      active = false;
    };
  }, [viewMode]);

  // Client-side search filtering
  const filteredData = data.filter((item) =>
    (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card/30 border-r backdrop-blur-sm">
      {/* Search & Tabs Section */}
      <div className="p-4 space-y-4">
        <Tabs value={viewMode} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50">
            <TabsTrigger value="frameworks" className="text-xs uppercase tracking-wider font-bold">Frameworks</TabsTrigger>
            <TabsTrigger value="features" className="text-xs uppercase tracking-wider font-bold">Features</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder={`Filter ${viewMode}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 h-9 bg-background/50 border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-primary transition-all text-sm"
          />
        </div> */}
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-muted">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg bg-muted/40" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-xs text-muted-foreground italic">No {viewMode} matched.</p>
          </div>
        ) : (
          <nav className="flex flex-col gap-0.5">
            {filteredData.map((item) => {
              const isSelected = selectedEntity?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className={cn(
                    "group relative flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border mb-1",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <span className="truncate">{item.name}</span>
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                  {!isSelected && (
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}