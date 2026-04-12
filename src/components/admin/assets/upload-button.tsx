"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
// 1. Import the Server Action instead of the client utility
import { uploadAssetAction } from "@/app/actions/assets"; 
import { UploadAssetDialog } from "./asset-dialog";

interface UploadButtonProps {
  onUploadSuccess: () => void;
}

export function UploadButton({ onUploadSuccess }: UploadButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setSelectedFile(files[0]);
    setIsDialogOpen(true);
  };

  const handleFinalUpload = async (newName: string) => {
    if (!selectedFile) return;

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading image...");

    try {
      // 2. Prepare FormData because Server Actions require it for File transfers
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 3. Call the Server Action
      const res = await uploadAssetAction(formData, newName);

      if (!res.success) {
        toast.error(`Upload failed: ${res.error}`, { id: uploadToast });
      } else {
        toast.success("Image uploaded successfully!", { id: uploadToast });
        setIsDialogOpen(false);
        setSelectedFile(null);
        onUploadSuccess();
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { id: uploadToast });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isUploading}
        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Image
      </Button>

      <UploadAssetDialog
        isOpen={isDialogOpen}
        onClose={() => !isUploading && setIsDialogOpen(false)}
        onConfirm={handleFinalUpload}
        originalFileName={selectedFile?.name || ""}
        isUploading={isUploading}
      />
    </>
  );
}