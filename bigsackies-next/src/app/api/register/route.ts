import { NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email: email }, { name: name }],
      },
    });

    if (existingUser) {
      return new NextResponse("User with this email or name already exists", {
        status: 409, // Conflict
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // Created
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 