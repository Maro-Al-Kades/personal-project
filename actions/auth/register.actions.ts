"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { transliterate } from "@/lib/utils";

export async function RegisterAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const storeName = formData.get("storeName") as string;

  const hashedPassword = await bcrypt.hash(password, 12);

  const slug = transliterate(storeName);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      stores: {
        create: {
          name: storeName,
          slug,
        },
      },
    },
  });

  (await cookies()).set("sessionToken", user.id, { path: "/" });

  redirect(`/dashboard`);
}
