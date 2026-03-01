import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CreateProductForm from "@/app/(merchant)/_components/CreateProductForm";

export default async function CreateNewProductPage() {
  const userId = (await cookies()).get("sessionToken")?.value;
  if (!userId) redirect("/login");

  const store = await prisma.store.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!store) throw new Error("المتجر غير موجود");

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-xl" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>

      <CreateProductForm categories={categories} />
    </div>
  );
}