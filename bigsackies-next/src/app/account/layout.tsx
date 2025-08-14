import { auth } from "@/lib/auth";
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-space-gradient opacity-60" />
      <div className="stars opacity-30" />
      <div className="nebula-particles" />
      
      <div className="container mx-auto pt-24 py-8 relative z-10">
        <div className="flex">
          <aside className="w-1/4 pr-8">
            <nav className="flex flex-col space-y-2">
              <h3 className="font-bold text-lg text-stellar-white">My Account</h3>
              <Link
                href="/account/profile"
                className="text-stellar-silver hover:text-nebula-hot-pink transition-colors"
              >
                Profile
              </Link>
              <Link
                href="/account/orders"
                className="text-stellar-silver hover:text-nebula-hot-pink transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className="text-stellar-silver hover:text-nebula-hot-pink transition-colors"
              >
                Addresses
              </Link>
              <Link
                href="/account/messages"
                className="text-stellar-silver hover:text-nebula-hot-pink transition-colors"
              >
                Messages
              </Link>
            </nav>
          </aside>
          <main className="w-3/4">{children}</main>
        </div>
      </div>
    </div>
  );
} 