// actions/auth/login.actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LoginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "Invalid email or password" };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { error: "Invalid email or password" };
    }

    (await cookies()).set("sessionToken", user.id, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // optional: 7 days
    });

    // This throws NEXT_REDIRECT → Next.js handles the redirect
    redirect("/dashboard");

  } catch (error) {
    // Only log/handle real errors — re-throw redirect so Next.js can process it
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // ← Critical: let Next.js catch this
    }

    console.error("Login error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}