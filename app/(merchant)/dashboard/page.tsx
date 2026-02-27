import { requireAuth } from "@/actions/auth/require.actions";
import { DeleteProductAction } from "@/actions/products/products.actions";
import { ActivateStoreAction } from "@/actions/store/stores.actions";
import { LogoutButton } from "@/components/LogoutBtn";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const MerchantDashboardRoute = async () => {
  const userId = await requireAuth();

  const store = await prisma.store.findFirst({
    where: { userId },
    include: { products: true },
  });

  if (!store) return <div>No Store Found</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{store.name} Dashboard</h1>

      <div className="mb-6">
        <a
          href="/dashboard/products/new"
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Add Product
        </a>
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

                  revalidatePath("/dashboard");
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

      <form
        action={async () => {
          "use server";
          await ActivateStoreAction();
        }}
      >
        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Activate Store – 2000 EGP
        </button>
      </form>

      <LogoutButton />
    </div>
  );
};

export default MerchantDashboardRoute;
