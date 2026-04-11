"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    await authClient.signIn.social({
      provider: "google",
      newUserCallbackURL: '/check',
      callbackURL: `/check`,
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {/* Subtle Grid using theme border color */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Animated Glows */}
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-primary/15 blur-[120px] animate-pulse [animation-delay:2s]" />
        
        <div className="absolute inset-0 bg-background/20 mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,transparent_0%,#000_100%)]" />
      </div>
      
      <Card className="relative w-full max-w-[400px] border-border/40 bg-card/60 backdrop-blur-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transition-all duration-500">
        <CardHeader className="space-y-4 pt-12 pb-8">
          <div className="mx-auto mb-2 relative group cursor-default">
            {/* Glow effect for logo */}
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 mx-auto w-20 h-20 -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2" />
            
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 border border-primary/20 text-4xl font-black italic text-primary shadow-inner tracking-tighter">
              D.
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground/70 text-base font-medium">
              Manage DevBuilds with precision.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pb-12 px-8">
          <Button 
            variant="outline" 
            className="group relative w-full h-14 border-border/50 bg-background/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 active:scale-[0.98] rounded-xl text-lg font-semibold overflow-hidden shadow-sm" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {/* Subtle shine effect */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <div className="flex items-center justify-center relative">
              {isLoading ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin text-primary" />
              ) : (
                <FcGoogle className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              )}
              <span className="tracking-tight">Continue with Google</span>
            </div>
          </Button>
          
          <div className="mt-10 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/20" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold">
              <span className="bg-card/0 px-4 text-muted-foreground/30 backdrop-blur-sm">
                Restricted Access
              </span>
            </div>
          </div>
          
          <p className="mt-8 text-center text-[11px] font-bold text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors cursor-default uppercase tracking-widest">
            DevBuilds • Keep Hustling
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
