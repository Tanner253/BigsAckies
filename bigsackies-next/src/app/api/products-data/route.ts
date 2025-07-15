import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: { categories: true },
      orderBy: { created_at: "desc" },
    });
    const categories = await prisma.categories.findMany();

    const formattedProducts = products.map((p: any) => ({
      ...p,
      price: Number(p.price),
      stock: Number(p.stock),
    }));

    return NextResponse.json({
      products: formattedProducts,
      categories,
    });
  } catch (error) {
    console.error("PRODUCT_DATA_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 