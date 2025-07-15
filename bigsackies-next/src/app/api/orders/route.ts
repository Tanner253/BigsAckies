import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientSecret = searchParams.get("payment_intent_client_secret");

  if (!clientSecret) {
    return new NextResponse("Missing client_secret", { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);

    // Here you would typically save the order to your database
    // For example:
    // await prisma.orders.create({ data: { ... } });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    console.error("ORDER_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 