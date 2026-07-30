import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AuthProvider } from "@/context/auth-context";
import { AuthModal } from "@/components/shared/auth-modal";
import { Toaster } from "sonner";

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KortSync | Play. Dine. Repeat.",
  description: "Premium indoor sports and dining under one roof — book badminton & cricket courts, order from our café, and manage memberships in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>
            <AuthProvider>
              {children}
              <AuthModal />
              <Toaster richColors position="top-center" closeButton />
            </AuthProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
