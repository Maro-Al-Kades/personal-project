import { requireAuth } from "@/actions/auth/require.actions";
import { ActivateStoreAction } from "@/actions/store/stores.actions";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

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

      <form
        action={async () => {
          "use server";
          await ActivateStoreAction();
        }}
      >
        <Button type="submit">تفعيل المتجر</Button>
      </form>
    </div>
  );
};

export default MerchantDashboardRoute;
