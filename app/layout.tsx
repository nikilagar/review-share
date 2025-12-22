import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Review Share",
  description: "Share reviews and earn respect",
};

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ...

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import BannedView from "./components/BannedView";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const isBanned = session?.user?.isBanned;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {isBanned ? (
          <BannedView />
        ) : (
          <Providers>
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </Providers>
        )}
      </body>
    </html>
  );
}
