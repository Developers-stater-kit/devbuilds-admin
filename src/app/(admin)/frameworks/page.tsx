import { FrameworksTable } from "@/components/admin/frameworks/frameworks-table";
import { getAllFrameworks } from "./action";


export default async function FrameworksPage() {
  try {
    const response = await getAllFrameworks();

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch frameworks");
    }

    const frameworksArray = response.data ?? [];

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Frameworks</h1>
        </div>
        <FrameworksTable initialData={frameworksArray} />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading features: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
}