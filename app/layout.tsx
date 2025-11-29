import type { Metadata } from "next";
import "./globals.css";
import WebAppProvider from "./components/WebAppProvider";

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
      <body className="bg-black text-white min-h-screen">
        <WebAppProvider>{children}</WebAppProvider>
      </body>
    </html>
  );
}