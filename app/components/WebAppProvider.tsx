"use client";

import { useEffect } from "react";

export default function WebAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@twa-dev/sdk").then(({ default: WebApp }) => {
        WebApp.ready();
        WebApp.expand();
        WebApp.setHeaderColor("#000000");
        WebApp.setBackgroundColor("#000000");
      });
    }
  }, []);

  return <>{children}</>;
}

