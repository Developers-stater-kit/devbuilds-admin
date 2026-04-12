// src/app/templates/page.tsx

import { TemplatesTable } from "@/components/admin/templates/templates-table";
import { getAllTemplates } from "./action";

export default async function TemplatesPage() {
  try {
    const response = await getAllTemplates();

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch templates");
    }

    const templatesArray = response.data ?? [];

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
        </div>

        <TemplatesTable initialData={templatesArray} />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading templates:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}