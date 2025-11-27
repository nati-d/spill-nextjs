import type { Metadata } from "next";
import "./globals.css";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

export const metadata: Metadata = {
  title: "Spill",
  description: "Anonymous confessions in Telegram",
};

export default function RootLayout({
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

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">{children}</body>
    </html>
  );
}