import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const product = await prisma.products.findUnique({
      where: { id: parsedId },
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