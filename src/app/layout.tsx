import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Squid Launcher",
  description: "High-performance Desktop Game Launcher",
};

import Sidebar from "@/components/Layout/Sidebar";
import TitleBar from "@/components/Layout/TitleBar";
import Particles from "@/components/Particles";
import { GameProvider } from "@/context/GameContext";
import { AuthProvider } from "@/context/AuthContext";
import { Inter } from "next/font/google";
import UpdateOverlay from "@/components/UpdateOverlay";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <GameProvider>
            <UpdateOverlay />
            <div className="layout">
              <Sidebar />
              <div className="main-content">
                <TitleBar />
                <main className="content-area">
                  <Particles />
                  {children}
                </main>
              </div>
            </div>
          </GameProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
