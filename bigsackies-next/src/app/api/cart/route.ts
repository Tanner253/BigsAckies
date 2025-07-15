import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// Add an item to the cart
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return new NextResponse("Missing productId or quantity", {
        status: 400,
      });
    }

    // 1. Find the user's cart, or create one if it doesn't exist
    let cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
      });
    }

    // 2. Check if the item is already in the cart
    const existingCartItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (existingCartItem) {
      // 3a. If it exists, update the quantity
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
      return NextResponse.json(updatedItem);
    } else {
      // 3b. If it doesn't exist, create a new cart item
      const newItem = await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity,
        },
      });
      return NextResponse.json(newItem);
    }
  } catch (error) {
    console.error("CART_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all items in the cart
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!cart) {
      // If user has no cart, return an empty array
      return NextResponse.json({ cart_items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("CART_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 