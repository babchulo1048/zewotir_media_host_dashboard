import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import localFont from "next/font/local";
import { BusinessProvider } from "@/context/BusinessContext";
import { LiveModeProvider } from "@/context/LiveModeContext";
import { Toaster } from "@/components/ui/sonner";
import { BusinessCheckWrapper } from "@/components/BusinessCheckWrapper";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

import { ThemeProvider } from "@/components/theme-provider";

const roboto = localFont({
  src: [
    {
      path: "./fonts/Roboto-VariableFont_wdth,wght.ttf",
      weight: "100 900", // full variable weight range
      style: "normal",
    },
    {
      path: "./fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={`${roboto.variable} font-roboto antialiased`}>
          <LiveModeProvider>
            <BusinessProvider>
              <SidebarProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Toaster position="top-right" />
                  {children}
                </ThemeProvider>
              </SidebarProvider>
            </BusinessProvider>
          </LiveModeProvider>
          s
        </body>
      </html>
    </>
  );
}
