"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "@/context/AppContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppProvider>{children}</AppProvider>
    </SessionProvider>
  );
}
