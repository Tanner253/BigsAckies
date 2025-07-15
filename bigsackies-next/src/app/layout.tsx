import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";
import ParticlesBackground from "@/components/ParticlesBackground";
import { NotificationProvider } from "@/components/NotificationSystem";
import CosmicFooter from "@/components/CosmicFooter";

const exo2 = Exo_2({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "BigsAckies - Cosmic Reptile Paradise",
  description: "Explore the universe of premium reptiles in our cosmic marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scrollbar-cosmic">
      <body className={exo2.className}>
        {/* Cosmic Background Layers */}
        <div className="cosmic-background" />
        <ParticlesBackground count={80} speed={0.3} />
        <div className="stars" />
        <div className="nebula-particles" />
        
        {/* Main Content */}
        <div className="relative z-10">
          <NotificationProvider>
            <AuthProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <CosmicFooter />
            </AuthProvider>
          </NotificationProvider>
        </div>
      </body>
    </html>
  );
}
