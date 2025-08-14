import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { NotificationProvider } from "@/components/NotificationSystem";
import LayoutWrapper from "@/components/LayoutWrapper";

const exo2 = Exo_2({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "BiggsAckies - Cosmic Reptile Paradise",
  description: "Explore the universe of premium reptiles in our cosmic marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${exo2.className} bg-slate-900`}>
        <AuthProvider>
          <NotificationProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
