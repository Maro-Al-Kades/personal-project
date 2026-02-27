"use client";

import { LogoutAction } from "@/actions/auth/logout.actions";

export function LogoutButton() {
  return (
    <form action={LogoutAction}>
      <button
        type="submit"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </form>
  );
}
