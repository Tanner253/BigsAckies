import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// Clear all items from cart
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    // Get user's cart
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Remove all items from cart
    await prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Cart cleared successfully",
      cartItemCount: 0,
      cartTotal: "0.00"
    });
  } catch (error) {
    console.error("CART_CLEAR_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 