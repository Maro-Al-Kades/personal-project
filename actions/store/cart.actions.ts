import { prisma } from "@/lib/prisma";
import { MustUserID } from "../auth/auth-helpers.actions";
import { revalidatePath } from "next/cache";

export async function AddToCartAction(storeSlug: string, productId: string) {
  const userId = await MustUserID();

  // Bring store
  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  // Bring Product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId: store.id,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Add to cart (or update quantity if already in cart)
  await prisma.cartItem.upsert({
    where: {
      userId_productId: { userId, productId },
    },

    update: {
      quantity: {
        increment: 1,
      },
    },

    create: {
      userId,
      storeId: store.id,
      productId,
      quantity: 1,
    },
  });

  return {
    success: true,
  };
}

export async function GetCartItemsAction(storeSlug: string) {
  const userId = await MustUserID();

  // Bring Store
  const store = await prisma.store.findFirst({
    where: {
      slug: storeSlug,
    },

    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const items = await prisma.cartItem.findMany({
    where: {
      userId,
      storeId: store.id,
    },

    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      },
    },

    orderBy: { createdAt: "desc" },
  });

  return { store, items };
}

export async function UpdateCartItemQtyAction(
  cartItemId: string,
  storeSlug: string,
  type: "increment" | "decrement",
) {
  const userId = await MustUserID();

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
    select: { id: true, quantity: true },
  });

  if (!cartItem) throw new Error("Cart item not found");

  if (type === "decrement") {
    if (cartItem.quantity <= 1) {
      await prisma.cartItem.delete({ where: { id: cartItemId } });
      revalidatePath(`/store/${storeSlug}/cart`);
      return { deleted: true };
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: { decrement: 1 } },
    });

    revalidatePath(`/store/${storeSlug}/cart`);
    return { success: true };
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: { increment: 1 } },
  });

  revalidatePath(`/store/${storeSlug}/cart`);
  return { success: true };
}

export async function RemoveCartItemAction(
  cartItemId: string,
  storeSlug: string,
) {
  const userId = await MustUserID();

  await prisma.cartItem.deleteMany({
    where: { id: cartItemId, userId },
  });

  revalidatePath(`/store/${storeSlug}/cart`);
  return { success: true };
}
