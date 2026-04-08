import { fetchBackend } from "@/lib/api";
import { FeaturesTable } from "@/components/admin/features/features-table";

export default async function FeaturesPage() {
  try {
    const response = await fetchBackend("/api/admin/features");
    const featuresArray = Array.isArray(response) ? response : response?.data || [];

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Features</h1>
        </div>
        <FeaturesTable initialData={featuresArray} />
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