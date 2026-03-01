import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/actions/auth/require.actions";
import { DeleteCategoryAction } from "@/actions/admin/categories.actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function CategoriesPage() {
  const userId = await requireAuth();

  // نفترض إن التاجر عنده متجر واحد حالياً
  const store = await prisma.store.findFirst({
    where: { userId },
    select: { id: true, name: true },
  });

  if (!store) {
    return <div className="wrapper py-10">لم يتم العثور على متجر</div>;
  }

  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="wrapper py-10" dir="rtl">
      {/* الهيدر */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold">التصنيفات</h1>
          <p className="text-sm text-muted-foreground">
            متجر: <span className="font-medium">{store.name}</span>
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/categories/new">+ إضافة تصنيف</Link>
        </Button>
      </div>

      {/* المحتوى */}
      {categories.length === 0 ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>لا توجد تصنيفات بعد</CardTitle>
            <CardDescription>
              ابدأ بإضافة أول تصنيف علشان تقدر تضيف منتجات بسهولة.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{cat.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <span className="truncate">{cat.slug}</span>
                    <Badge variant="secondary">Slug</Badge>
                  </div>
                </div>

                <form
                  action={async () => {
                    "use server";
                    await DeleteCategoryAction(cat.id, store.id);
                  }}
                >
                  <Button type="submit" variant="destructive">
                    حذف
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}