"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
} 