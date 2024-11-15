import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { appConstants } from "./constants";
import { Toaster } from "@/components/ui/toaster";
import { NavigationFeedback } from "./navigation-feedback";
import { Suspense } from "react";
import { PosthogProvider } from "@/lib/analytics-service/components/posthog-provider.client";
import { PageView } from "@/lib/analytics-service/components/pageview.client";
import AuthProvider from "@/lib/auth-service/provider";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://tripwise.andretreib.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tripwise.andretreib.com",
    siteName: `${appConstants.APP_NAME} | Your AI-powered travel companion`,
    images: [
      {
        url: "/assets/person-enjoying-travel-planned-using-tripwise.png",
        width: 1200,
        height: 630,
        alt: `${appConstants.APP_NAME} | Your AI-powered travel companion`,
      },
    ],
  },
  applicationName: appConstants.APP_NAME,
  title: {
    template: "%s | " + appConstants.APP_NAME,
    default: appConstants.APP_NAME + " | Your AI-powered travel companion",
  },
  description: `${appConstants.APP_NAME} is your AI-powered travel companion. It helps you plan your next trip, find the best places to eat, and more.`,
  keywords: [
    appConstants.APP_NAME,
    "AI",
    "travel",
    "companion",
    "planner",
    "restaurants",
    "hotels",
    "flights",
    "vacation",
  ],
  authors: [{ name: "Andre Treib", url: "https://andretreib.com" }],
  creator: "Andre Treib",
  publisher: "Andre Treib",
  category: "travel",
  robots: {
    index: true,
    follow: true,
  },
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <PosthogProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            {children}
            <Suspense fallback={null}>
              <PageView />
            </Suspense>
            <Suspense fallback={null}>
              <NavigationFeedback />
            </Suspense>
            <Toaster />
          </body>
        </PosthogProvider>
      </html>
    </AuthProvider>
  );
}
