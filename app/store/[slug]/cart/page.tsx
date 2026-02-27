import Link from "next/link";
import {
  GetCartItemsAction,
  RemoveCartItemAction,
  UpdateCartItemQtyAction,
} from "@/actions/store/cart.actions";

export default async function CartPage({
  params,
}: {
  params: { slug: string };
}) {
  const { store, items } = await GetCartItemsAction(params.slug);

  const total = items.reduce((acc, item) => {
    return acc + item.product.price * item.quantity;
  }, 0);

  return (
    <div className="wrapper py-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="h2-bold">Cart — {store.name}</h1>

        {items.length > 0 && (
          <Link
            href={`/store/${store.slug}/checkout`}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Checkout
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className="border rounded-xl p-6">
          <p>السلة فاضية.</p>
          <Link
            href={`/store/${store.slug}`}
            className="inline-block mt-4 underline text-sm"
          >
            رجوع للمتجر
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm opacity-80">
                    Qty: {item.quantity} — Price: {item.product.price}
                  </p>
                </div>

                <div className="font-semibold min-w-[110px] text-right">
                  {item.product.price * item.quantity} EGP
                </div>

                {/* Qty Controls */}
                <div className="flex items-center gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await UpdateCartItemQtyAction(
                        item.id,
                        store.slug,
                        "decrement",
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="h-9 w-9 rounded-lg border text-lg"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                  </form>

                  <span className="min-w-[24px] text-center font-semibold">
                    {item.quantity}
                  </span>

                  <form
                    action={async () => {
                      "use server";
                      await UpdateCartItemQtyAction(
                        item.id,
                        store.slug,
                        "increment",
                      );
                    }}
                  >
                    <button
                      type="submit"
                      className="h-9 w-9 rounded-lg border text-lg"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </form>
                </div>

                {/* Remove */}
                <form
                  action={async () => {
                    "use server";
                    await RemoveCartItemAction(item.id, store.slug);
                  }}
                >
                  <button
                    type="submit"
                    className="text-red-600 text-sm font-medium underline"
                  >
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>

          {/* Total + Checkout */}
          <div className="mt-8 border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xl font-bold">Total: {total} EGP</div>

            <Link
              href={`/store/${store.slug}/checkout`}
              className="bg-black text-white px-5 py-3 rounded-xl text-sm font-medium text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
