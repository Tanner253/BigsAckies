import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        categories: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT_DETAIL_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 