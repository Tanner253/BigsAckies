"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: number, newStatus: string) {
  await prisma.orders.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/admin/orders`);
} 