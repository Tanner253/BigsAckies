import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notFound } from "next/navigation";
import Image from "next/image";

async function getOrderDetails(orderId: number, userId: number) {
  const order = await prisma.orders.findUnique({
    where: { 
      id: orderId,
      user_id: userId // Ensure user can only access their own orders
    },
    include: {
      users: true,
      order_items: {
        include: {
          products: true,
        },
      },
    },
  });
  return order;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

  const { id } = await params;
  const orderId = parseInt(id, 10);
  const userId = parseInt(session.user.id, 10);
  const order = await getOrderDetails(orderId, userId);

  if (!order) {
    return notFound();
  }

  return (
    <div className="space-y-8">
      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-stellar-white">Order #{order.id}</CardTitle>
          <CardDescription className="text-stellar-silver/70">
            Placed on{" "}
            {new Date(order.created_at!).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Status:</strong> <span className="text-nebula-cyan">{order.status}</span></p>
          <p><strong>Total:</strong> <span className="font-bold text-nebula-gold">${Number(order.total_amount).toFixed(2)}</span></p>
        </CardContent>
      </Card>

      <Card className="card-cosmic">
        <CardHeader>
          <CardTitle>Items in this Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price at Time</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-4">
                     <div className="relative w-16 h-16 rounded-md overflow-hidden bg-space-dark">
                        <Image
                            src={item.products?.image_url || "/placeholder.png"}
                            alt={item.products?.name || "Product Image"}
                            layout="fill"
                            objectFit="cover"
                        />
                     </div>
                     <span>{item.products?.name}</span>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${Number(item.price_at_time).toFixed(2)}
                  </TableCell>
                   <TableCell>
                    ${(Number(item.price_at_time) * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 