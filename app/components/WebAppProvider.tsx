"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export default function WebAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor("#000000");
      WebApp.setBackgroundColor("#000000");
    }
  }, []);

  return <>{children}</>;
}

