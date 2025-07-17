"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Clean, explicit types for the client component
export interface OrderProduct {
  name: string | null;
}

export interface OrderItem {
  quantity: number;
  price_at_time: number;
  products: OrderProduct | null;
}

export interface Order {
  id: number;
  created_at: Date | null;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
}

interface OrdersClientProps {
  orders: Order[];
}

export default function OrdersClient({ orders }: OrdersClientProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nebula-violet to-nebula-magenta flex items-center justify-center">
            <ShoppingBag className="text-white" size={24} />
        </div>
        <h1 className="text-3xl font-bold text-stellar-white">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center card-cosmic p-8 rounded-xl">
          <Package className="mx-auto h-12 w-12 text-stellar-silver/50" />
          <h3 className="mt-4 text-lg font-semibold text-stellar-white">No orders yet</h3>
          <p className="mt-1 text-sm text-stellar-silver/70">
            You haven't placed any orders yet. Start exploring our products!
          </p>
          <div className="mt-6">
            <Button asChild className="btn-cosmic">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      ) : (
         <div className="card-cosmic rounded-xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>
                        {new Date(order.created_at!).toLocaleDateString()}
                        </TableCell>
                        <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={`/account/orders/${order.id}`}>View Details</Link>
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      )}
    </motion.div>
  );
} 