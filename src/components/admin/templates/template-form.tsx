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
import { toast } from "sonner";
import {
    Globe,
    Terminal,
    Image,
    Tag,
    User,
    FileText,
    Link,
    Loader2,
    Star,
    DollarSign,
} from "lucide-react";
import { templates } from "@/db/schema/templates/templates";
import { createTemplate, updateTemplate } from "@/app/(admin)/templates/action";

export type Template = typeof templates.$inferSelect;

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

const templateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
    description: z.string().min(1, "Description is required"),
    category: z.string().optional(),
    thumbnail: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    previewUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    githubUrl: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    cliCommand: z.string().optional(),
    pricingType: z.enum(["FREE", "PAID"]),
    isFeatured: z.boolean(),
    authorName: z.string().optional(),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type TemplateFormProps = {
    initialData?: Template | null;
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
            {error && (
                <p className="text-xs text-destructive">{error}</p>
            )}
        </div>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function TemplateForm({ initialData, onSuccess, onCancel }: TemplateFormProps) {

    const form = useForm<TemplateFormValues>({
        resolver: zodResolver(templateSchema),
        defaultValues: {
            title: initialData?.title || "",
            slug: initialData?.slug || "",
            description: initialData?.description || "",
            category: initialData?.category || "",
            thumbnail: initialData?.thumbnail || "",
            previewUrl: initialData?.previewUrl || "",
            githubUrl: initialData?.githubUrl || "",
            cliCommand: initialData?.cliCommand || "",
            pricingType: initialData?.pricingType || "FREE",
            isFeatured: initialData?.isFeatured || false,
            authorName: initialData?.authorName || "",
        },
    });

    const { handleSubmit, control, watch, formState: { errors, isSubmitting } } = form;

    const pricingType = watch("pricingType");
    const isFeatured = watch("isFeatured");

    const onSubmit = async (values: TemplateFormValues) => {
        // Define the server action execution
        const actionCall = async () => {
            let res;

            if (initialData?.id) {
                // Update existing template
                res = await updateTemplate(initialData.id, values);
            } else {
                // Create new template (matching your 'data' wrapper pattern)
                res = await createTemplate({ data: values });
            }

            if (!res.success) {
                throw new Error(res.mssg || "An error occurred while saving.");
            }

            return res;
        };

        // Use toast to handle the loading, success, and error states
        toast.promise(actionCall(), {
            loading: `${initialData ? "Updating" : "Creating"} template...`,
            success: () => {
                onSuccess();
                return `Template ${initialData ? "updated" : "created"} successfully`;
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
                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <FormField id="title" label="Title" icon={FileText} required error={errors.title?.message}>
                                    <Input {...field} id="title" placeholder="e.g. Acme SaaS Landing" />
                                </FormField>
                            )}
                        />
                        <Controller
                            name="slug"
                            control={control}
                            render={({ field }) => (
                                <FormField id="slug" label="Slug" icon={Link} required error={errors.slug?.message}>
                                    <Input
                                        {...field}
                                        id="slug"
                                        placeholder="e.g. acme-saas"
                                        disabled={!!initialData}
                                        className={initialData ? "opacity-50 cursor-not-allowed" : ""}
                                    />
                                </FormField>
                            )}
                        />
                    </div>

                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <FormField id="description" label="Short Description" icon={FileText} required error={errors.description?.message}>
                                <Input {...field} id="description" placeholder="A short tagline shown in listings and the CLI" />
                            </FormField>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <FormField id="category" label="Category" icon={Tag} error={errors.category?.message}>
                                    <Input {...field} id="category" placeholder="e.g. SaaS, Portfolio" />
                                </FormField>
                            )}
                        />
                        <Controller
                            name="authorName"
                            control={control}
                            render={({ field }) => (
                                <FormField id="authorName" label="Author Name" icon={User} error={errors.authorName?.message}>
                                    <Input {...field} id="authorName" placeholder="e.g. DevBuilds Team" />
                                </FormField>
                            )}
                        />
                    </div>
                </FormSection>

                <Separator />

                {/* Links & Assets */}
                <FormSection title="Links & Assets">
                    <Controller
                        name="thumbnail"
                        control={control}
                        render={({ field }) => (
                            <FormField id="thumbnail" label="Thumbnail Cover URL" icon={Image} error={errors.thumbnail?.message}>
                                <Input {...field} id="thumbnail" type="url" placeholder="https://..." />
                            </FormField>
                        )}
                    />
                    <Controller
                        name="previewUrl"
                        control={control}
                        render={({ field }) => (
                            <FormField id="previewUrl" label="Live Preview URL" icon={Globe} error={errors.previewUrl?.message}>
                                <Input {...field} id="previewUrl" type="url" placeholder="https://..." />
                            </FormField>
                        )}
                    />
                    <Controller
                        name="githubUrl"
                        control={control}
                        render={({ field }) => (
                            <FormField id="githubUrl" label="GitHub Repository URL" icon={Terminal} error={errors.githubUrl?.message}>
                                <Input {...field} id="githubUrl" type="url" placeholder="https://github.com/..." />
                            </FormField>
                        )}
                    />
                    <Controller
                        name="cliCommand"
                        control={control}
                        render={({ field }) => (
                            <FormField id="cliCommand" label="CLI Install Command" icon={Terminal} error={errors.cliCommand?.message}>
                                <Input
                                    {...field}
                                    id="cliCommand"
                                    placeholder="dvkit templates saas-landing"
                                    className="font-mono text-sm"
                                />
                            </FormField>
                        )}
                    />
                </FormSection>

                <Separator />

                {/* Settings */}
                <FormSection title="Settings">
                    <div className="flex flex-col gap-4">

                        <Controller
                            name="pricingType"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-start gap-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="pricingPaid"
                                        checked={field.value === "PAID"}
                                        onCheckedChange={(checked) =>
                                            field.onChange(checked ? "PAID" : "FREE")
                                        }
                                        className="mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="pricingPaid" className="flex items-center gap-2 cursor-pointer font-medium">
                                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                                            Mark as Premium
                                            <Badge variant={pricingType === "PAID" ? "default" : "secondary"} className="text-[10px]">
                                                {pricingType}
                                            </Badge>
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Paid templates show a redirect prompt in the CLI instead of cloning.
                                        </p>
                                    </div>
                                </div>
                            )}
                        />

                        <Controller
                            name="isFeatured"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-start gap-3 rounded-lg border p-4">
                                    <Checkbox
                                        id="isFeatured"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="mt-0.5"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="isFeatured" className="flex items-center gap-2 cursor-pointer font-medium">
                                            <Star className="h-3.5 w-3.5 text-muted-foreground" />
                                            Feature on Homepage
                                            {isFeatured && (
                                                <Badge variant="secondary" className="text-[10px]">Featured</Badge>
                                            )}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            Featured templates appear in the CLI's curated list shown to users.
                                        </p>
                                    </div>
                                </div>
                            )}
                        />

                    </div>
                </FormSection>

            </div>

            {/* ── Sticky footer ── */}
            <div className="border-t px-6 py-4 flex items-center justify-end gap-2 bg-background">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Saving..." : initialData ? "Update Template" : "Create Template"}
                </Button>
            </div>

        </form>
    );
}