import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Flash Costing — Product Cost Intelligence",
  description: "GAP Flash Costing: sketch-to-cost prediction, designer feedback, and scenario modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
