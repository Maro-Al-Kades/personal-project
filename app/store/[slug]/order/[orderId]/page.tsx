import { MustSession } from "@/actions/auth/auth-helpers.actions";
import { prisma } from "@/lib/prisma";

function formatEGPFromCents(cents: number) {
  // cents -> EGP
  const egp = cents / 100;
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 2,
  }).format(egp);
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; orderId: string }>;
}) {
  const { slug, orderId } = await params;

  const { guestSessionId } = await MustSession();

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      guestSessionId,
      store: { slug },
    },
    include: {
      items: { include: { product: { select: { name: true } } } },
      store: { select: { name: true } },
    },
  });

  if (!order) {
    return <div className="wrapper py-10">Order not found</div>;
  }

  return (
    <div className="wrapper py-10">
      <h1 className="h2-bold mb-2">Order Confirmed ✅</h1>
      <p className="mb-6 opacity-80">
        Store: {order.store.name} — Order ID: {order.id}
      </p>

      <div className="space-y-3">
        {order.items.map((it) => (
          <div
            key={it.id}
            className="border rounded-xl p-4 flex justify-between"
          >
            <div>
              <div className="font-semibold">{it.product.name}</div>
              <div className="text-sm opacity-80">
                {it.quantity} × {formatEGPFromCents(it.price)}
              </div>
            </div>

            <div className="font-semibold">
              {formatEGPFromCents(it.quantity * it.price)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 font-bold text-xl">
        Total: {formatEGPFromCents(order.total)}
      </div>
    </div>
  );
}