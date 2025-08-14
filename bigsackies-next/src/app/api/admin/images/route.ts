import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
    // @ts-ignore
  if (session?.user?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const images = await prisma.images.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("IMAGE_FETCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 