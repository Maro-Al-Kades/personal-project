import { requireAuth } from "@/actions/auth/require.actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const userId = await requireAuth();
  const store = await prisma.store.findFirst({
    where: { userId },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-300 p-4">Sidebar</aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
