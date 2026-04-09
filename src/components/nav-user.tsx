"use client";

import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export type UserType = {
  name: string;
  email: string;
  image?: string;
};

export function NavUser({ user }: { user: UserType }) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(`/login`);
            toast.success("Logged out successfully");
          },
        },
      });
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Keep Hustling! 🚀</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Build something amazing today.
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            <DropdownMenuItem 
              className="text-destructive focus:bg-destructive/10 focus:text-destructive" 
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}




export function NavUserSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" disabled className="cursor-default">
          {/* Profile Picture Skeleton */}
          <Skeleton className="h-8 w-8 rounded-md bg-sidebar-accent-foreground/10" />
          
          <div className="grid flex-1 gap-1.5 text-left text-sm leading-tight">
            {/* Name Skeleton */}
            <Skeleton className="h-3 w-24 bg-sidebar-accent-foreground/10" />
            {/* Email Skeleton */}
            <Skeleton className="h-2 w-32 bg-sidebar-accent-foreground/10" />
          </div>
          
          {/* Arrow Icon Skeleton */}
          <Skeleton className="ml-auto size-4 rounded-full bg-sidebar-accent-foreground/10" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}