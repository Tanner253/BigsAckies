import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { AdminShell } from "./AdminShell";
import { Session } from "next-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/login?error=Unauthorized");
  }

  return <AdminShell session={session as Session}>{children}</AdminShell>;
} 