"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else if (session.user.role === "ADMIN") {
        const timer = setTimeout(() => router.push("/"), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [session, isPending, router]);

  // 1. Loading UI
  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium tracking-widest uppercase opacity-50">
          Verifying Identity...
        </p>
      </div>
    );
  }

  // 2. Unauthorized UI
  if (session && session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] p-4">
        <Card className="w-full max-w-md border-destructive/20 bg-destructive/5 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center pt-10 pb-10 text-center">
            <div className="mb-4 rounded-full bg-destructive/10 p-3">
              <ShieldAlert className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-white">Access Denied</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account does not have administrative privileges.
            </p>
            <Button
              variant="destructive"
              className="mt-6 w-full"
              onClick={() => authClient.signOut()}
            >
              Sign Out & Switch Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. Success UI (Admin found)
  if (session?.user.role === "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-xl font-bold">Welcome, Admin</h1>
        <p className="mt-2 text-sm text-muted-foreground">Keep Hustling. Redirecting to terminal...</p>
      </div>
    );
  }

  return null;
}