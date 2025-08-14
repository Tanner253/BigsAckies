"use server";

import prisma from "@/lib/db";

interface ContactFormData {
  email: string;
  message: string;
  userId: number | null;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    await prisma.messages.create({
      data: {
        user_email: formData.email,
        message: formData.message,
        user_id: formData.userId,
        status: "Unread",
      },
    });
    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
} 