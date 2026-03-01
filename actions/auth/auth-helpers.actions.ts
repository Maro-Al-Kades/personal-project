import { prisma } from "@/lib/prisma";
import { GetGuestSessionId } from "./guest.actions";

export async function MustSession() {
  const guestSessionId = await GetGuestSessionId();
  return { guestSessionId };
}

export async function MustOwnStore(storeId: string, userId: string) {
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      userId,
    },

    select: {
      id: true,
      slug: true,
    },
  });

  if (!store) {
    throw new Error("Store not found");
  }

  return store;
}
