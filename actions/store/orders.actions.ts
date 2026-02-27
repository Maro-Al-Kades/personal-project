"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { PaymentMethodKey } from "@/constants/payment-methods";
import { MustSession } from "../auth/auth-helpers.actions";

export async function CreateOrderAction(
  storeSlug: string,
  data: {
    fullName: string;
    phone: string;
    address: string;
    paymentMethod: PaymentMethodKey;
  },
) {
  const { guestSessionId } = await MustSession();

  if (!storeSlug) throw new Error("storeSlug is missing");

  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    select: { id: true, slug: true },
  });

  if (!store) throw new Error("Store not found");

  const cartItems = await prisma.cartItem.findMany({
    where: { guestSessionId, storeId: store.id },
    include: { product: { select: { id: true, price: true, name: true } } },
  });

  if (cartItems.length === 0) throw new Error("Cart is empty");

  // لأن Order.subtotal/total Int (قروش)
  const subtotal = cartItems.reduce((acc, item) => {
    const priceInCents = Math.round(item.product.price * 100);
    return acc + priceInCents * item.quantity;
  }, 0);

  const shipping = 0;
  const total = subtotal + shipping;

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        guestSessionId,
        storeId: store.id,

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
            price: Math.round(item.product.price * 100),
            quantity: item.quantity,
          })),
        },
      },
      select: { id: true },
    });

    await tx.cartItem.deleteMany({
      where: { guestSessionId, storeId: store.id },
    });

    return created;
  });

  redirect(`/store/${store.slug}/order/${order.id}`);
}