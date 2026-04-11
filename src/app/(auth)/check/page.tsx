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

  // ✅ ALL redirects here
  useEffect(() => {
    if (isPending) return;

    // not logged in
    if (!session?.user) {
      router.replace("/login");
      return;
    }

    // admin redirect
    if (session.user.role === "ADMIN") {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [session, isPending, router]);

  // ✅ Loading
  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm">Verifying Identity...</p>
      </div>
    );
  }

  // ✅ Prevent render during redirect
  if (!session?.user) return null;

  // ✅ Not admin
  if (session.user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center pt-10 pb-10">
            <h1>Access Denied</h1>
            <Button onClick={() => authClient.signOut()}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ✅ Admin UI
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        <ShieldCheck className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-xl font-bold">Welcome, Admin</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Keep Hustling. Redirecting to terminal...
      </p>
    </div>
  );
}