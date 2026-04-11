import React from 'react'
import { GET_CURRENT_USER } from '@/lib/session';
import { redirect } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '../sidebar';
import { AdminHeader } from '@/components/header';

export default async function layout({ children }: { children: React.ReactNode }) {
    const loggedInUser = await GET_CURRENT_USER();
    if (!loggedInUser) {
        redirect('/login');
    }

    if (loggedInUser?.role !== 'ADMIN') {
        redirect('/check');
    }
    return (
        <SidebarProvider>
            <AdminSidebar/>
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
