"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Key,
  Layers,
  Loader2,
  FlaskConical,
  GitFork,
  FileText,
} from "lucide-react";

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

const frameworkSchema = z.object({
  name: z.string().min(1, "Name is required"),
  uniqueKey: z
    .string()
    .min(1, "Unique key is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Key can only contain lowercase letters, numbers, and hyphens"
    ),
  repoName: z.string().min(1, "Repository name is required"),
  scope: z.array(z.string()).min(1, "At least one scope is required"),
  status: z.enum(["ACTIVE", "INACTIVE", "DEPRECATED", "PENDING"]),
  isExperimental: z.boolean(),
});

import { Framework } from "@/types/admin";

type FrameworkFormValues = z.infer<typeof frameworkSchema>;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type FrameworkFormProps = {
  initialData?: Framework | null;
  onSuccess: () => void;
  onCancel: () => void;
};

// ─── SUB COMPONENTS ───────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function FormField({
  id,
  label,
  icon: Icon,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-sm font-medium">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const SCOPES = ["FRONTEND", "BACKEND", "FULLSTACK"];

export function FrameworkForm({ initialData, onSuccess, onCancel }: FrameworkFormProps) {
  const form = useForm<FrameworkFormValues>({
    resolver: zodResolver(frameworkSchema),
    defaultValues: {
      name: initialData?.name || "",
      uniqueKey: initialData?.uniqueKey || "",
      repoName: initialData?.repoName || "",
      scope: initialData?.scope || [],
      status: initialData?.status || "PENDING",
      isExperimental: initialData?.isExperimental || false,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const scopeValue = watch("scope");
  const isExperimental = watch("isExperimental");

  const handleScopeToggle = (scope: string) => {
    const current = scopeValue || [];
    const exists = current.includes(scope);
    setValue(
      "scope",
      exists ? current.filter((s) => s !== scope) : [...current, scope],
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: FrameworkFormValues) => {
    const url = initialData?.id
      ? `/api/admin/frameworks/${initialData.id}`
      : `/api/admin/frameworks`;
    const method = initialData?.id ? "PUT" : "POST";

    const savePromise = fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then(async (res) => {
      const result = await res.json();
      if (!res.ok) throw new Error(result.mssg || result.error || "Failed to save framework");
      return result;
    });

    toast.promise(savePromise, {
      loading: `${initialData ? "Updating" : "Creating"} framework...`,
      success: () => {
        onSuccess();
        return `Framework ${initialData ? "updated" : "created"} successfully`;
      },
      error: (err) => err.message,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto space-y-8 px-6 py-6">

        {/* Basic Info */}
        <FormSection title="Basic Info">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormField id="name" label="Name" icon={FileText} required error={errors.name?.message}>
                <Input {...field} id="name" placeholder="e.g. Next.js App Router" />
              </FormField>
            )}
          />

          <Controller
            name="uniqueKey"
            control={control}
            render={({ field }) => (
              <FormField id="uniqueKey" label="Unique Key" icon={Key} required error={errors.uniqueKey?.message}>
                <Input
                  {...field}
                  id="uniqueKey"
                  placeholder="e.g. nextjs-app-router"
                  disabled={!!initialData}
                  className={initialData ? "opacity-50 cursor-not-allowed font-mono text-sm" : "font-mono text-sm"}
                />
              </FormField>
            )}
          />

          <Controller
            name="repoName"
            control={control}
            render={({ field }) => (
              <FormField id="repoName" label="Repository Name" icon={GitFork} required error={errors.repoName?.message}>
                <Input {...field} id="repoName" placeholder="e.g. devbuilds/nextjs-starter" className="font-mono text-sm" />
              </FormField>
            )}
          />
        </FormSection>

        <Separator />

        {/* Configuration */}
        <FormSection title="Configuration">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormField id="status" label="Status" icon={Layers} required error={errors.status?.message}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="DEPRECATED">DEPRECATED</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Scope
              <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              {SCOPES.map((scope) => (
                <div
                  key={scope}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 hover:bg-accent/50 transition-colors"
                // REMOVED onClick from here to prevent loops
                >
                  <Checkbox
                    id={`scope-${scope}`}
                    checked={scopeValue?.includes(scope)}
                    onCheckedChange={() => handleScopeToggle(scope)} // Handle toggle here
                  />
                  <Label
                    htmlFor={`scope-${scope}`}
                    className="flex-1 cursor-pointer font-medium text-sm py-1"
                  // No stopPropagation needed now
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{scope}</span>
                      {scopeValue?.includes(scope) && (
                        <Badge variant="secondary" className="text-[10px]">Selected</Badge>
                      )}
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            {errors.scope && (
              <p className="text-xs text-destructive">{errors.scope.message}</p>
            )}
          </div>
        </FormSection>

        <Separator />

        {/* Settings */}
        <FormSection title="Settings">
          <Controller
            name="isExperimental"
            control={control}
            render={({ field }) => (
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  id="isExperimental"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-1">
                  <Label htmlFor="isExperimental" className="flex items-center gap-2 cursor-pointer font-medium">
                    <FlaskConical className="h-3.5 w-3.5 text-muted-foreground" />
                    Experimental Framework
                    {isExperimental && (
                      <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">
                        Experimental
                      </Badge>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Marks this framework as unstable beta. Users will be warned before using it.
                  </p>
                </div>
              </div>
            )}
          />
        </FormSection>

      </div>

      {/* ── Sticky footer ── */}
      <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : initialData ? "Update Framework" : "Create Framework"}
        </Button>
      </div>

    </form>
  );
}