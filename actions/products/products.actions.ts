"use server";

import { prisma } from "@/lib/prisma";
import { transliterate } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function CreateProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const image = formData.get("image") as string;

  const userId = (await cookies()).get("sessionToken")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const store = await prisma.store.findFirst({
    where: { userId },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const baseSlug = transliterate(name);

  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 6)}`;

  await prisma.product.create({
    data: {
      name,
      price,
      image,
      slug,
      storeId: store.id,
    },
  });

  redirect("/dashboard");
}

export async function DeleteProductAction(productId: string) {
  await prisma.product.delete({
    where: { id: productId },
  });
}
