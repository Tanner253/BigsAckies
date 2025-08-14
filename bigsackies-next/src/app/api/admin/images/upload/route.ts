import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const session = await auth();
  // @ts-ignore
  if (session?.user?.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return new NextResponse("No file provided", { status: 400 });
  }

  // Convert file to buffer
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);

  try {
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
          {
            folder: "bigsackies-next",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    // Save image metadata to our database
    const newImage = await prisma.images.create({
      data: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
    });

    return NextResponse.json(newImage);
  } catch (error) {
    console.error("CLOUDINARY_UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 