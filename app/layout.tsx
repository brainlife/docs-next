import type { Metadata } from "next";
import { Inter, Work_Sans, Roboto } from "next/font/google";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { getAssetPath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "brainlife Documentation",
  description: "brainlife.io promotes engagement and education in reproducible neuroscience by providing an online, community-based platform where users can publish code (Apps) and Data while integrating HPC and cloud-computing resources.",
  icons: {
    icon: [
      { url: getAssetPath('/logo.svg'), type: 'image/svg+xml' },
      { url: getAssetPath('/logo.png'), sizes: '512x512', type: 'image/png' },
      { url: getAssetPath('/favicon.ico') },
    ],
    shortcut: [getAssetPath('/logo.svg')],
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
      className={`${workSans.variable} ${roboto.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href={getAssetPath('/logo.svg')} />
        <link rel="icon" type="image/png" href={getAssetPath('/logo.png')} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-[#1a202c] text-[#2d3748] dark:text-[#eceef6]">
        {children}
      </body>
    </html>
  );
}
