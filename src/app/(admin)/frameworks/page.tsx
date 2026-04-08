import { fetchBackend } from "@/lib/api";
import { FrameworksTable } from "@/components/admin/frameworks/frameworks-table";


export default async function FrameworksPage() {
  try {
    const response = await fetchBackend("/api/admin/frameworks");

    // Extract the array depending on the API response shape
    const frameworksArray = Array.isArray(response) ? response : response?.data || [];

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