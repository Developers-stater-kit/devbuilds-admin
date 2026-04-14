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
import { MoreHorizontal, Plus, Pencil, Trash, ExternalLink, Activity } from "lucide-react";
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
import { TemplateForm } from "./template-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { templates } from "@/db/schema/templates/templates";
import { deleteTemplate } from "@/app/(admin)/templates/action";

export type Template = typeof templates.$inferSelect;

export function TemplatesTable({ initialData = [] }: { initialData: Template[] }) {
  const router = useRouter();
  const data = initialData;
  const [pricingFilter, setPricingFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);

  const openEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingTemplate(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!templateToDelete?.id) return;

    try {
      const res = await deleteTemplate(templateToDelete.id);

      if (!res.success) {
        throw new Error(res.mssg || "Failed to delete template.");
      }

      toast.success("Template deleted successfully");
      setTemplateToDelete(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while deleting.");
    }
  };

  const filteredData = data.filter((item) => {
    const matchPricing = pricingFilter === "ALL" || item.pricingType === pricingFilter;
    
    const matchStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && item.isActive) || 
      (statusFilter === "DRAFT" && !item.isActive);

    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      (item.subtitle?.toLowerCase() || "").includes(search.toLowerCase());

    return matchPricing && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-4">

      {/* ── Filters & Actions ── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Search title, slug or subtitle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[250px]"
          />
          
          <Select value={pricingFilter} onValueChange={setPricingFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Pricing Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Pricing</SelectItem>
              <SelectItem value="FREE">FREE</SelectItem>
              <SelectItem value="PAID">PREMIUM</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active (Live)</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={openCreate} className="h-10">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-md border bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Info</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Pricing</TableHead>
              <TableHead>Options</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No templates found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{template.title}</span>
                        <Badge 
                          variant={template.isActive ? "default" : "outline"} 
                          className={template.isActive 
                            ? "bg-emerald-500 hover:bg-emerald-600 border-transparent text-white text-[10px] h-4 px-1.5" 
                            : "text-[10px] h-4 px-1.5 text-muted-foreground"
                          }
                        >
                          {template.isActive ? "Live" : "Draft"}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {template.subtitle && <span className="italic font-medium text-foreground/60">"{template.subtitle}"</span>}
                        {template.subtitle && " • "}
                        {template.slug} • {template.authorName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{template.category || "Uncategorized"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={template.pricingType === "PAID" ? "default" : "secondary"}
                      className={template.pricingType === "PAID" ? "bg-amber-500 hover:bg-amber-600" : ""}
                    >
                      {template.pricingType === "PAID" ? "PREMIUM" : "FREE"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs">
                      {template.isFeatured && (
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          Featured
                        </span>
                      )}
                      {template.previewUrl && (
                        <a
                          href={template.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          Preview <ExternalLink className="ml-1 -mt-0.5 h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(template.cliCommand ?? "")}
                        >
                          Copy CLI Command
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(template)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => setTemplateToDelete(template)}
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
            <DialogTitle>{editingTemplate ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update storefront and configuration details for this template."
                : "Add a template for users to generate via CLI."}
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            initialData={editingTemplate}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation ── */}
      <AlertDialog
        open={!!templateToDelete}
        onOpenChange={(open) => !open && setTemplateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This will remove{" "}
              <span className="font-semibold">{templateToDelete?.title}</span> immediately.
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