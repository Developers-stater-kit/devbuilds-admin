"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Layers,
    Puzzle,
    Link2,
    LayoutTemplate,
} from "lucide-react";

export const adminNav = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Frameworks",
        url: "/frameworks",
        icon: Layers,
    },
    {
        title: "Features",
        url: "/features",
        icon: Puzzle,
    },
    {
        title: "Relations",
        url: "/relations",
        icon: Link2,
    },
    {
        title: "Templates",
        url: "/templates",
        icon: LayoutTemplate,
    },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-3">
                    <p className="text-base font-bold tracking-tight">
                        D
                    </p>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={adminNav} itemsCategory="Admin" />
            </SidebarContent>
        </Sidebar>
    );
}