import { CreateCategoryAction } from "@/actions/admin/categories.actions";
import { requireAuth } from "@/actions/auth/require.actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewCategoryPage() {
  const userId = await requireAuth();

  const store = await prisma.store.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!store) {
    return <div className="wrapper py-10">No store found</div>;
  }

  return (
    <div className="wrapper py-10 max-w-lg">
      <h1 className="h2-bold mb-6">Create Category</h1>

      <form
        action={async (formData) => {
          "use server";
          const name = formData.get("name") as string;

          await CreateCategoryAction(store.id, name);

          redirect("/dashboard/categories");
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          required
          placeholder="Category name"
          className="w-full border rounded-xl px-4 py-2"
        />

        <button
          type="submit"
          className="bg-black text-white px-6 py-2 rounded-xl"
        >
          Create
        </button>
      </form>
    </div>
  );
}
