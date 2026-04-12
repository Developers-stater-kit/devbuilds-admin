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
import { FrameworkForm } from "./frameworks-from";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { frameworks } from "@/db/schema/resources";
import { deleteFramework } from "@/app/(admin)/frameworks/action";

export type Framework = typeof frameworks.$inferSelect;


export function FrameworksTable({ initialData = [] }: { initialData: Framework[] }) {
  const router = useRouter();
  const data = initialData;
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState<Framework | null>(null);
  const [frameworkToDelete, setFrameworkToDelete] = useState<Framework | null>(null);

  const openEdit = (framework: Framework) => {
    setEditingFramework(framework);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingFramework(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!frameworkToDelete?.id) return;

    try {
      const res = await deleteFramework(frameworkToDelete.id);

      if (!res.success) {
        throw new Error(res.mssg || "Failed to delete framework.");
      }

      toast.success("Framework deleted successfully");
      setFrameworkToDelete(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.uniqueKey.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* ── Filters & Actions ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search frameworks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[250px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="DEPRECATED">DEPRECATED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openCreate} className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          New Framework
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unique Key</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Experimental</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No frameworks found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((framework) => (
                <TableRow key={framework.uniqueKey}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{framework.name}</span>
                      <span className="text-xs text-muted-foreground">{framework.repoName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {framework.uniqueKey}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {framework.scope.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        framework.status === "ACTIVE"
                          ? "default"
                          : framework.status === "DEPRECATED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {framework.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {framework.isExperimental ? (
                      <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm ml-2">—</span>
                    )}
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
                          onClick={() => navigator.clipboard.writeText(framework.uniqueKey)}
                        >
                          Copy unique key
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(framework)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setFrameworkToDelete(framework)}
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
            <DialogTitle>{editingFramework ? "Edit Framework" : "Create Framework"}</DialogTitle>
            <DialogDescription>
              {editingFramework
                ? "Make changes to the framework settings here."
                : "Add a new framework to the platform instance."}
            </DialogDescription>
          </DialogHeader>
          <FrameworkForm
            initialData={editingFramework}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!frameworkToDelete}
        onOpenChange={(open) => !open && setFrameworkToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Framework?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will permanently delete{" "}
              <span className="font-semibold text-foreground">
                {frameworkToDelete?.name}
              </span>{" "}
              and remove all associated records.
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