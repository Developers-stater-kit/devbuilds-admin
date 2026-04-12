"use client";

import React from "react";
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
  FileText,
  Key,
  GitFork,
  Layers,
  FlaskConical,
  Loader2,
} from "lucide-react";
import { features } from "@/db/schema/resources";
import { createFeatures, updateFeature } from "@/app/(admin)/features/action";

export type Feature = typeof features.$inferSelect;


const featureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  uniqueKey: z
    .string()
    .min(1, "Unique key is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Key can only contain lowercase letters, numbers, and hyphens"
    ),
  repoName: z.string().min(1, "Repository name is required"),
  featureType: z.enum(["AUTHENTICATION", "DATABASE", "PAYMENTS"]),
  status: z.enum(["ACTIVE", "INACTIVE", "DEPRECATED", "PENDING"]),
  isExperimental: z.boolean(),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

type FeatureFormProps = {
  initialData?: Feature | null;
  onSuccess: () => void;
  onCancel: () => void;
};

// --- SUB COMPONENTS ---

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

// --- MAIN COMPONENT ---

export function FeatureForm({ initialData, onSuccess, onCancel }: FeatureFormProps) {
  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      name: initialData?.name || "",
      uniqueKey: initialData?.uniqueKey || "",
      repoName: initialData?.repoName || "",
      featureType: initialData?.featureType || "AUTHENTICATION",
      status: initialData?.status || "PENDING",
      isExperimental: initialData?.isExperimental || false,
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const isExperimental = watch("isExperimental");

  const onSubmit = async (values: FeatureFormValues) => {
    const actionCall = async () => {
      let res;
      if (initialData?.id) {
        res = await updateFeature(initialData.id, values);
      } else {
        res = await createFeatures({ data: values });
      }

      if (!res.success) {
        throw new Error(res.mssg || "An error occurred");
      }
      return res;
    };

    toast.promise(actionCall(), {
      loading: `${initialData ? "Updating" : "Creating"} feature...`,
      success: () => {
        onSuccess();
        return `Feature ${initialData ? "updated" : "created"} successfully`;
      },
      error: (err) => err.message,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-8 px-6 py-6">
        {/* Basic Info */}
        <FormSection title="Basic Info">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormField id="name" label="Name" icon={FileText} required error={errors.name?.message}>
                <Input {...field} id="name" placeholder="e.g. NextAuth Authentication" />
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
                  placeholder="e.g. nextauth-v5"
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
                <Input
                  {...field}
                  id="repoName"
                  placeholder="e.g. devbuilds/nextauth-feature"
                  className="font-mono text-sm"
                />
              </FormField>
            )}
          />
        </FormSection>

        <Separator />

        {/* Configuration */}
        <FormSection title="Configuration">
          <Controller
            name="featureType"
            control={control}
            render={({ field }) => (
              <FormField id="featureType" label="Feature Type" icon={Layers} required error={errors.featureType?.message}>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="featureType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTHENTICATION">AUTHENTICATION</SelectItem>
                    <SelectItem value="DATABASE">DATABASE</SelectItem>
                    <SelectItem value="PAYMENTS">PAYMENTS</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            )}
          />

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
                    Experimental Feature
                    {isExperimental && (
                      <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">
                        BETA
                      </Badge>
                    )}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Marks this feature as unstable beta. Users will be warned before using it.
                  </p>
                </div>
              </div>
            )}
          />
        </FormSection>
      </div>

      {/* Sticky footer */}
      <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Saving..." : initialData ? "Update Feature" : "Create Feature"}
        </Button>
      </div>
    </form>
  );
}