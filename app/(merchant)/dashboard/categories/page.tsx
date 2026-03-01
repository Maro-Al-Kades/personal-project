import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/actions/auth/require.actions";
import { DeleteCategoryAction } from "@/actions/admin/categories.actions";

export default async function CategoriesPage() {
  const userId = await requireAuth();

  // نفترض إن التاجر عنده Store واحد حالياً
  const store = await prisma.store.findFirst({
    where: { userId },
    select: { id: true, name: true },
  });

  if (!store) {
    return <div className="wrapper py-10">No store found</div>;
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="wrapper py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="h2-bold">Categories — {store.name}</h1>

        <Link
          href="/dashboard/categories/new"
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          + Add Category
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="border rounded-xl p-6 text-center opacity-70">
          No categories yet
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex justify-between items-center border rounded-xl p-4"
            >
              <div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm opacity-70">{cat.slug}</div>
              </div>

              <form
                action={async () => {
                  "use server";
                  await DeleteCategoryAction(cat.id, store.id);
                }}
              >
                <button className="text-red-500 font-semibold">Delete</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
