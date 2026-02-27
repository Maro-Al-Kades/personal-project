import { GetGuestSessionId } from "./guest.actions";

export async function MustSession() {
  const guestSessionId = await GetGuestSessionId();
  return { guestSessionId };
}
