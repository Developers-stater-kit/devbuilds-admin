import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AdminSidebar } from '../sidebar'
import { AdminHeader } from '@/components/header'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { GET_CURRENT_USER } from '@/lib/session'

export default async function layout({ children }: { children: React.ReactNode }) {
    // const cookieStore = await cookies();
    // const session = cookieStore.get("better-auth.session_token");

    // if (!session) {
    //     redirect("/login");
    // }

    const user = await GET_CURRENT_USER();

    if (!user) redirect("/login");

    // Ensure the string matches your DB Enum casing (usually 'ADMIN')
    if (user.role !== "ADMIN") {
        redirect("/check");
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
