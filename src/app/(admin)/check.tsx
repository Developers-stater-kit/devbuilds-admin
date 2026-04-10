"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import { AdminSidebar } from '../sidebar'
import { AdminHeader } from '@/components/header'
import { useSession } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AdminCheck({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!isPending) {
            if (!session || session?.user?.role !== "ADMIN") {
                router.push("/check");
            }
        }
    }, [session, isPending, router]);

    if (isPending || !session || session?.user?.role !== "ADMIN") {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="flex flex-col flex-1 w-full">
                <div className="flex items-center gap-2 h-14 px-4 border-b bg-background">
                    <SidebarTrigger />
                    <div className="flex-1" />
                    <AdminHeader />
                </div>
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
