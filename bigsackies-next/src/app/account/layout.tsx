import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex">
        <aside className="w-1/4 pr-8">
          <nav className="flex flex-col space-y-2">
            <h3 className="font-bold text-lg">My Account</h3>
            <Link
              href="/account/profile"
              className="hover:text-purple-400"
            >
              Profile
            </Link>
            <Link
              href="/account/orders"
              className="hover:text-purple-400"
            >
              Orders
            </Link>
            <Link
              href="/account/addresses"
              className="hover:text-purple-400"
            >
              Addresses
            </Link>
          </nav>
        </aside>
        <main className="w-3/4">{children}</main>
      </div>
    </div>
  );
} 