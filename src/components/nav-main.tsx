// @/components/nav-main.tsx
"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function NavMain({
  items,
  itemsCategory,
  className,
}:{
  itemsCategory?: string;
  className?: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    isFocused?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const currentUrl = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{itemsCategory}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = item.url === currentUrl;
          const isTabActive = tab === item.url.split("&tab=")[1];
          const hasDropdown = item.items && item.items.length > 0;

          if (hasDropdown) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const subIsActive = subItem.url === currentUrl;
                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={
                              subIsActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : ""
                            }
                          >
                            <SidebarMenuSubButton
                              asChild
                              // data-umami-event={`dashboard-${item.title}-${subItem.title}-button`}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }
          
          return (
            <SidebarMenuItem
              key={item.title}
              className={
                isActive || isTabActive
                  ? "dark:bg-sidebar-accent bg-stone-200 rounded-md text-sidebar-accent-foreground"
                  : ""
              }
            >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className={cn(
                  className,
                  item.isFocused && "dark:bg-zinc-800 rounded-md"
                )}
                // data-umami-event={`dashboard-${item.title}-button`}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}