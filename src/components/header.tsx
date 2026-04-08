"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { BackendStatus } from "./admin/status-check";

export function AdminHeader() {
    return (
        <header className="flex items-center justify-end gap-3 h-14 px-4 border-b bg-background w-full">
            <BackendStatus />
            <ThemeToggle />
        </header>
    );
}