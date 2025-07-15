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

async function getOrderDetails(id: number) {
  const order = await prisma.orders.findUnique({
    where: { id },
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
  params: { id: string };
}) {
  const orderId = parseInt(params.id, 10);
  const order = await getOrderDetails(orderId);

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
          <CardDescription>
            Placed on{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString()
              : "N/A"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Customer:</strong> {order.users?.name || "Guest"}
          </p>
          <p>
            <strong>Email:</strong> {order.users?.email}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> ${Number(order.total_amount).toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.order_items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.products.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    ${Number(item.price_at_time).toFixed(2)}
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