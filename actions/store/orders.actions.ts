"use server";

import { prisma } from "@/lib/prisma";
import { MustUserID } from "@/actions/auth/auth-helpers.actions";
import { redirect } from "next/navigation";
import type { PaymentMethodKey } from "@/constants/payment-methods";

export async function CreateOrderAction(
  storeSlug: string,
  data: {
    fullName: string;
    phone: string;
    address: string;
    paymentMethod: PaymentMethodKey;
  }
) {
  const userId = await MustUserID();

  if (!storeSlug) throw new Error("storeSlug is missing");

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, slug: true },
  });

  if (!store) throw new Error("Store not found");

  const cartItems = await prisma.cartItem.findMany({
    where: { userId, storeId: store.id },
    include: { product: { select: { id: true, price: true, name: true } } },
  });

  if (cartItems.length === 0) throw new Error("Cart is empty");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        storeId: store.id,

        // ✅ ده لازم يكون موجود في Prisma model كـ String
        paymentMethod: data.paymentMethod,

        status: "PENDING",
        subtotal,
        shipping,
        total,
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      select: { id: true },
    });

    await tx.cartItem.deleteMany({
      where: { userId, storeId: store.id },
    });

    return created;
  });

  redirect(`/store/${store.slug}/order/${order.id}`);
}