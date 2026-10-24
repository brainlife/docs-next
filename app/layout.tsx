import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "@fontsource/work-sans/800.css";
import "./globals.css";

import { getAssetPath } from "@/lib/basePath";

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
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="icon" type="image/png" href={getAssetPath('/logo.png')} />
        <link rel="shortcut icon" href={getAssetPath('/logo.png')} />
        <link rel="apple-touch-icon" href={getAssetPath('/logo.png')} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#1a202c] text-[#2d3748] dark:text-[#eceef6]">
        {children}
      </body>
    </html>
  );
}
