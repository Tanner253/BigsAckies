import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";
import OrdersClient from "./OrdersClient";
import { Order } from "./OrdersClient";

async function getUserOrders(): Promise<Order[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const userId = parseInt(session.user.id, 10);

  const orders = await prisma.orders.findMany({
    where: { user_id: userId },
    include: {
      order_items: {
        include: {
          products: {
            select: { name: true }
          },
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Manually map to the client-safe Order type
  return orders.map(order => ({
    ...order,
    total_amount: Number(order.total_amount),
    order_items: order.order_items.map(item => ({
        ...item,
        price_at_time: Number(item.price_at_time)
    }))
  }));
}

export default async function OrdersPage() {
  const orders = await getUserOrders();

  return <OrdersClient orders={orders} />;
} 