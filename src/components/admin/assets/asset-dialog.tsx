"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface DeleteAssetDialogProps {
  name: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteAssetDialog({ name, onConfirm, isDeleting }: DeleteAssetDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50"
          disabled={isDeleting}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Are you sure you want to delete <span className="font-semibold text-zinc-200">"{name}"</span>? 
            This action cannot be undone and will remove the file from storage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white border-none"
          >
            {isDeleting ? "Deleting..." : "Delete Image"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


// --- UPLOAD NAMING DIALOG ---
interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  originalFileName: string;
  isUploading: boolean;
}

export function UploadAssetDialog({ isOpen, onClose, onConfirm, originalFileName, isUploading }: UploadDialogProps) {
  const [assetName, setAssetName] = useState("");

  // Set initial value to filename without extension when opened
  useEffect(() => {
    if (isOpen) {
      const nameWithoutExt = originalFileName.split('.').slice(0, -1).join('.');
      setAssetName(nameWithoutExt || originalFileName);
    }
  }, [isOpen, originalFileName]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && onClose()}>
      <DialogContent className="border-zinc-800 bg-zinc-900 text-zinc-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Asset</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Give your image a recognizable name before uploading.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-zinc-300">Asset Name</Label>
            <Input
              id="name"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="e.g. Hero Banner Main"
              className="border-zinc-800 bg-zinc-950 text-zinc-100 focus-visible:ring-zinc-700"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isUploading} className="hover:bg-zinc-800">
            Cancel
          </Button>
          <Button 
            onClick={() => onConfirm(assetName)} 
            disabled={isUploading || !assetName.trim()}
            className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
