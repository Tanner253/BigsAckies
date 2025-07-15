import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // @ts-ignore - We will fix the type error later
  if (!session || session.user?.role !== "admin") {
    redirect("/login?error=Unauthorized");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex">
        <aside className="w-1/4 pr-8">
          <nav className="flex flex-col space-y-2">
            <h3 className="font-bold text-lg">Admin Menu</h3>
            <Link
              href="/admin/dashboard"
              className="hover:text-purple-400"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="hover:text-purple-400"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="hover:text-purple-400"
            >
              Orders
            </Link>
             <Link
              href="/admin/customers"
              className="hover:text-purple-400"
            >
              Customers
            </Link>
          </nav>
        </aside>
        <main className="w-3/4">{children}</main>
      </div>
    </div>
  );
} 