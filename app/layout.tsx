import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import CONSTANT from "./CONSTANT";
import { MainLayout } from "./MainLayout";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl || "https://zerobytes.me"),
  title: `${CONSTANT.APP_NAME} - Cybersecurity Insights & Digital Forensics`,
  description: "Professional blog and portfolio showcasing cybersecurity expertise, digital forensics, penetration testing, and incident response knowledge.",
  keywords: ["cybersecurity", "digital forensics", "blog", "portfolio", "penetration testing", "incident response", "security analysis"],
  authors: [{ name: "Ramesh Mali" }],
  creator: "Ramesh Mali",
  publisher: "Zerobytes.me",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl || "https://zerobytes.me",
    siteName: CONSTANT.APP_NAME,
    title: `${CONSTANT.APP_NAME} - Cybersecurity Insights & Digital Forensics`,
    description: "Professional blog and portfolio showcasing cybersecurity expertise, digital forensics, penetration testing, and incident response knowledge.",
    images: [
      {
        url: "https://zerobytes.me/og-image.png",
        width: 1200,
        height: 630,
        alt: CONSTANT.APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONSTANT.APP_NAME} - Cybersecurity Insights & Digital Forensics`,
    description: "Professional blog and portfolio showcasing cybersecurity expertise.",
    creator: "@zero1byte",
  },
  alternates: {
    canonical: defaultUrl || "https://zerobytes.me",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  //if 
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>
          {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
