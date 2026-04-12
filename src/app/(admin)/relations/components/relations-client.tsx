"use client";

import { useState } from "react";


import { ViewMode, EntityBase } from "./types";
import SidebarList from "./sidebar-list";
import MainCanvas from "./main-canvas";

export default function RelationsClient() {
  const [viewMode, setViewMode] = useState<ViewMode>("frameworks");
  const [selectedEntity, setSelectedEntity] = useState<EntityBase | null>(null);

  // When we switch tabs (Framework vs Feature), reset selection
  const handleTabChange = (val: string) => {
    setViewMode(val as ViewMode);
    setSelectedEntity(null);
  };

  return (
    <div className="flex w-full h-full min-h-[600px] items-stretch">
      <div className="w-[35%] min-w-[250px] max-w-[400px] flex flex-col border-r h-full overflow-hidden bg-background">
        <SidebarList
          viewMode={viewMode}
          onTabChange={handleTabChange}
          selectedEntity={selectedEntity}
          onSelect={setSelectedEntity}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
        <MainCanvas viewMode={viewMode} selectedEntity={selectedEntity} />
      </div>
    </div>
  );
}
