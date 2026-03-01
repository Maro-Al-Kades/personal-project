import { AddToCartAction } from "@/actions/store/cart.actions";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) return notFound();

  const store = await prisma.store.findFirst({
    where: { slug },
    include: { products: true },
  });

  if (!store) return notFound();

  if (store.subscriptionStatus !== "active") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border rounded-2xl p-10 text-center">
          <h1 className="text-2xl font-bold mb-4">This store is not active</h1>
          <p className="text-gray-500">
            The merchant needs to activate the subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-10">{store.name}</h1>

      {store.products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {store.products.map((product) => (
            <div key={product.id} className="border rounded-xl p-4">
              {product.image && (
                <Image
                  width={1000}
                  height={1000}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <h2 className="text-lg font-semibold">{product.name}</h2>

              <p className="text-gray-600">{product.price} EGP</p>

              <Link href={`/store/${store.slug}/product/${product.slug}`}>
                View Product
              </Link>

              <form
                action={async () => {
                  "use server";
                  await AddToCartAction(store.slug, product.id);
                }}
              >
                <button className="mt-4 w-full bg-black text-white py-2 rounded-md">
                  Add to Cart
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/store/${store.slug}/categories`}
        className="px-4 py-2 rounded-xl border"
      >
        View Categories
      </Link>
    </div>
  );
}
