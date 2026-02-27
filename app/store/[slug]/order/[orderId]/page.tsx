import { prisma } from "@/lib/prisma";
import { MustUserID } from "@/actions/auth/auth-helpers.actions";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ slug: string; orderId: string }>;
}) {
  const { slug, orderId } = await params;
  const userId = await MustUserID();

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
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
                {it.quantity} × {it.price}
              </div>
            </div>
            <div className="font-semibold">{it.quantity * it.price}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4 font-bold text-xl">
        Total: {order.total}
      </div>
    </div>
  );
}