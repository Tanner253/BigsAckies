import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/db";

// Create a new order
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const { shippingAddress, orderNotes, cartItems } = await request.json();

    // Validate required fields
    if (!shippingAddress || !cartItems || cartItems.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Calculate order total
    const orderTotal = cartItems.reduce((total: number, item: any) => {
      return total + (item.quantity * Number(item.price));
    }, 0);

    // Create order
    const order = await prisma.orders.create({
      data: {
        user_id: userId,
        total_amount: orderTotal,
        status: "pending",
        shipping_address: JSON.stringify(shippingAddress),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      cartItems.map(async (item: any) => {
        return prisma.order_items.create({
          data: {
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_time: Number(item.price),
            created_at: new Date(),
          },
        });
      })
    );

    // Clear the user's cart after successful order creation
    const userCart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (userCart) {
      await prisma.cart_items.deleteMany({
        where: { cart_id: userCart.id },
      });
    }

    return NextResponse.json({
      id: order.id,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
      order_items: orderItems,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("ORDER_CREATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get user's orders
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            products: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("ORDERS_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 