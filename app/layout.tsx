import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

import { getAssetPath } from "@/lib/basePath";

// Same fonts as landing-next and brainlife-lite, so the docs, the site and the app read as one product.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "brainlife Documentation",
  description: "brainlife.io promotes engagement and education in reproducible neuroscience by providing an online, community-based platform where users can publish code (Apps) and Data while integrating HPC and cloud-computing resources.",
  icons: {
    icon: [
      { url: getAssetPath('/logo.png'), type: 'image/png' },
      { url: getAssetPath('/favicon.ico') },
    ],
    shortcut: [getAssetPath('/logo.png')],
    apple: [getAssetPath('/logo.png')],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" type="image/png" href={getAssetPath('/logo.png')} />
        <link rel="shortcut icon" href={getAssetPath('/logo.png')} />
        <link rel="apple-touch-icon" href={getAssetPath('/logo.png')} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-bl-bg text-bl-ink">
        {children}
      </body>
    </html>
  );
}
