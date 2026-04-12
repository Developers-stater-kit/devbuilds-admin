import { FeaturesTable } from "@/components/admin/features/features-table";
import { getAllFeatures } from "./action";

export default async function FeaturesPage() {
  try {
    const response = await getAllFeatures();

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch features");
    }

    const featuresArray = response.data ?? [];

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