import { requireAuth } from "@/actions/auth/require.actions";
import { DeleteProductAction } from "@/actions/products/products.actions";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

const MerchantProductsRoute = async () => {
  const userId = await requireAuth();

  const store = await prisma.store.findFirst({
    where: { userId },
    include: { products: true },
  });

  if (!store) return <div>No Store Found</div>;
  return (
    <div>
      <div className="my-6">
        <Button asChild>
          <Link href="/dashboard/products/new">اضافة منتج جديد</Link>
        </Button>
      </div>
      {store.products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div className="space-y-4">
          {store.products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.price} EGP</p>
              </div>

              <form
                action={async () => {
                  "use server";
                  await DeleteProductAction(product.id);

                  revalidatePath("/dashboard/products");
                }}
              >
                <button type="submit" className="text-red-500">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MerchantProductsRoute;
