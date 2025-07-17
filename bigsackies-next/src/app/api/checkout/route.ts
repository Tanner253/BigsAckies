import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST() {
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

    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
      return new NextResponse("Cart is empty", { status: 400 });
    }

    const totalAmount = cart.cart_items.reduce((acc, item) => {
      if (!item.products) return acc;
      return acc + item.quantity * Number(item.products.price);
    }, 0);

    // Stripe expects the amount in cents
    const amountInCents = Math.round(totalAmount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Change to your currency
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("CHECKOUT_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 