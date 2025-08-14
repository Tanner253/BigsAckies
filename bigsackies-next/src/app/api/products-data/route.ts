import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: { categories: true },
      orderBy: { created_at: "desc" },
    });
    const categories = await prisma.categories.findMany();
    
    // Correctly count completed orders using the same logic as the admin panel
    const completedOrders = await prisma.orders.count({
      where: {
        OR: [
          { is_paid: true },
          { status: 'delivered' },
          { status: 'succeeded' },
          { status: 'paid' },
        ]
      },
    });

    const formattedProducts = products.map((p: any) => {
      // Calculate stock properly for animals vs supplies
      let calculatedStock = 0;
      if (p.is_animal) {
        calculatedStock = (p.male_quantity || 0) + (p.female_quantity || 0) + (p.unknown_quantity || 0);
      } else {
        calculatedStock = p.stock || 0;
      }

      return {
        ...p,
        price: Number(p.price),
        stock: calculatedStock,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      categories,
      completedOrders,
    });
  } catch (error) {
    console.error("PRODUCT_DATA_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 