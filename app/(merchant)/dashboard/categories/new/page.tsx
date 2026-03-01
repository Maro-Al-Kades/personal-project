import { CreateCategoryAction } from "@/actions/admin/categories.actions";
import { requireAuth } from "@/actions/auth/require.actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function NewCategoryPage() {
  const userId = await requireAuth();

  const store = await prisma.store.findFirst({
    where: { userId },
    select: { id: true },
  });

  if (!store) {
    return <div className="wrapper py-10">لم يتم العثور على متجر</div>;
  }

  return (
    <div className="wrapper py-10 max-w-lg" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>إنشاء تصنيف جديد</CardTitle>
          <CardDescription>
            أضف تصنيف جديد لتنظيم منتجات متجرك بشكل أفضل.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              const name = formData.get("name") as string;

              await CreateCategoryAction(store.id, name);

              redirect("/dashboard/categories");
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">اسم التصنيف</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="مثال: ملابس رجالي"
              />
            </div>

            <Button type="submit" className="w-full">
              إنشاء التصنيف
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}