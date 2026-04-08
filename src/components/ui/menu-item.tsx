'use client';

import { ChevronRight, Users, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';
import { cn } from '@/lib/utils';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from './sidebar';

export function NavMain({
  items,
  itemsCategory,
  className,
  onItemClick,
}: {
  itemsCategory?: string;
  className?: string;
  onItemClick?: (title: string, url: string) => void;
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon | any;
    isActive?: boolean;
    isFocused?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon | any;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  function checkActive(url: string | undefined) {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + '/');
  }

  // Determine if any item has sub-items to decide the type automatically
  const hasSubItems = items.some((item) => item.items && item.items.length > 0);

  if (!hasSubItems) {
    return (
      <SidebarGroup>
        {itemsCategory && <SidebarGroupLabel>{itemsCategory}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = checkActive(item.url);
            return (
              <SidebarMenuItem
                key={item.title}
                className={
                  isActive
                    ? 'bg-sidebar-accent rounded-md text-sidebar-accent-foreground'
                    : ''
                }
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    className,
                    item.isFocused && 'bg-sidebar-accent rounded-md'
                  )}
                >
                  <Link href={item.url || '#'} onClick={() => onItemClick?.(item.title, item.url || '#')}>
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

  return (
    <SidebarGroup>
      {itemsCategory && <SidebarGroupLabel>{itemsCategory}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          // If item has sub-items, render as collapsible
          const isActive = checkActive(item.url);
          if (item.items && item.items.length > 0) {
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
                      {item.items.map((subItem) => {
                        const isActive = checkActive(subItem.url);
                        return (
                          <SidebarMenuSubItem
                            key={subItem.title}
                            className={
                              isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : ''
                            }
                          >
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} onClick={() => onItemClick?.(subItem.title, subItem.url)}>
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
          } else {
            return (
              <SidebarMenuItem
                key={item.title}
                className={
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : ''
                }
              >
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(className, 'text-sidebar-foreground')}
                >
                  <Link href={item.url || '#'} onClick={() => onItemClick?.(item.title, item.url || '#')}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
