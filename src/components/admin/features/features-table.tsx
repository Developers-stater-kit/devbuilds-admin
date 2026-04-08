"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Plus, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Feature } from "@/types/admin";
import { FeatureForm } from "./feature-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function FeaturesTable({ initialData = [] }: { initialData: Feature[] }) {
  const router = useRouter();
  const data = initialData;
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  

  const openEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingFeature(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!featureToDelete?.id) return;

    try {
      const res = await fetch(`/api/admin/features/${featureToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.mssg || result.error || "Failed to delete feature.");
      }

      toast.success("Feature deleted successfully");
      setFeatureToDelete(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchType = typeFilter === "ALL" || item.featureType === typeFilter;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.uniqueKey.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* ── Filters & Actions ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search features..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="DEPRECATED">DEPRECATED</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="AUTHENTICATION">AUTHENTICATION</SelectItem>
              <SelectItem value="DATABASE">DATABASE</SelectItem>
              <SelectItem value="PAYMENTS">PAYMENTS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          New Feature
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unique Key</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Repo</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No features found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((feature) => (
                <TableRow key={feature.uniqueKey}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground flex items-center gap-2">
                        {feature.name}
                        {feature.isExperimental && (
                          <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600 bg-amber-50">
                            BETA
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{feature.repoName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {feature.uniqueKey}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {feature.featureType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        feature.status === "ACTIVE"
                          ? "default"
                          : feature.status === "DEPRECATED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {feature.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono text-xs max-w-[200px] truncate">
                    {feature.repoName}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(feature.uniqueKey)}
                        >
                          Copy unique key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(feature)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setFeatureToDelete(feature)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[45vw] overflow-y-auto max-h-[95vh] rounded-lg">
          <DialogHeader>
            <DialogTitle>{editingFeature ? "Edit Feature" : "Create Feature"}</DialogTitle>
            <DialogDescription>
              {editingFeature
                ? "Update configuration details for this feature module."
                : "Register a new feature integration module."}
            </DialogDescription>
          </DialogHeader>
          <FeatureForm
            initialData={editingFeature}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!featureToDelete}
        onOpenChange={(open) => !open && setFeatureToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will remove{" "}
              <span className="font-semibold text-foreground">{featureToDelete?.name}</span>{" "}
              and any framework links associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}