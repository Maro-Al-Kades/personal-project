import { cookies } from "next/headers";

export async function MustUserID() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("sessionToken")?.value;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}
