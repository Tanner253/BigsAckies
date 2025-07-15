import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("PRODUCT_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 