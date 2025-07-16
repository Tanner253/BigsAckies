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

    if (!productId || !quantity || quantity < 1) {
      return new NextResponse("Invalid productId or quantity", {
        status: 400,
      });
    }

    // Check if product exists and has enough stock
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, is_animal: true, male_quantity: true, female_quantity: true, unknown_quantity: true }
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Calculate available stock
    let availableStock = 0;
    if (product.is_animal) {
      availableStock = (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0);
    } else {
      availableStock = product.stock || 0;
    }

    if (availableStock < quantity) {
      return new NextResponse(`Only ${availableStock} units available in stock`, {
        status: 400,
      });
    }

    // Find or create cart
    let cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { user_id: userId },
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (existingCartItem) {
      // Check if adding would exceed stock
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > availableStock) {
        return new NextResponse(`Cannot add ${quantity} more items. Only ${availableStock - existingCartItem.quantity} more available.`, {
          status: 400,
        });
      }

      // Update quantity
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
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

// Update cart item quantity
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const { productId, quantity } = await request.json();

    if (!productId || quantity === undefined || quantity < 1) {
      return new NextResponse("Invalid productId or quantity", {
        status: 400,
      });
    }

    // Get user's cart
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Check if product exists and has enough stock
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, is_animal: true, male_quantity: true, female_quantity: true, unknown_quantity: true }
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Calculate available stock
    let availableStock = 0;
    if (product.is_animal) {
      availableStock = (product.male_quantity || 0) + (product.female_quantity || 0) + (product.unknown_quantity || 0);
    } else {
      availableStock = product.stock || 0;
    }

    if (quantity > availableStock) {
      return new NextResponse(`Only ${availableStock} units available in stock`, {
        status: 400,
      });
    }

    // Update cart item
    const updatedItem = await prisma.cart_items.updateMany({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
      data: { quantity: quantity },
    });

    if (updatedItem.count === 0) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.error("CART_PUT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);

  try {
    const { productId } = await request.json();

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Get user's cart
    const cart = await prisma.carts.findFirst({
      where: { user_id: userId },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 404 });
    }

    // Remove item from cart
    const deletedItem = await prisma.cart_items.deleteMany({
      where: {
        cart_id: cart.id,
        product_id: productId,
      },
    });

    if (deletedItem.count === 0) {
      return new NextResponse("Cart item not found", { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error("CART_DELETE_ERROR", error);
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
      return NextResponse.json({ cart_items: [] });
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("CART_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 