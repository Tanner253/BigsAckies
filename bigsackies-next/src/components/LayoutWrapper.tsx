"use client";

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import CosmicFooter from "@/components/CosmicFooter";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <ParticlesBackground />
      <main className="pt-20">{children}</main>
      <CosmicFooter />
    </>
  );
} 