import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Header from "@/components/Header";

const exo2 = Exo_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BigsAckies",
  description: "A new era of Ackies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={exo2.className}>
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-space-bg via-nebula-purple/10 to-space-bg z-[-1]" />
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
