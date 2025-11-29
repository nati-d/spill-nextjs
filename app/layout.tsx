import type { Metadata } from "next";
import "./globals.css";
import WebAppProvider from "./components/WebAppProvider";
import Navbar from "./components/navbar";
import { BottomBar } from "./components/bottom-bar";

export const metadata: Metadata = {
  title: "Spill",
  description: "Anonymous confessions in Telegram",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col overflow-hidden">
        <WebAppProvider>
          <Navbar />
          <main className="flex-1 overflow-y-auto pt-16 pb-24">{children}</main>
          <BottomBar />
        </WebAppProvider>
      </body>
    </html>
  );
}
