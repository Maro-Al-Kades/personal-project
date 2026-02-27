// app/(auth)/login/page.tsx
"use client"; // ← Add this if you're using hooks like useActionState

import { LoginAction } from "@/actions/auth/login.actions";
import { useActionState } from "react";

const LoginRoute = () => {
  const [state, formAction] = useActionState(LoginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={formAction}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {state?.error && (
          <p className="text-red-500 text-sm">{state.error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginRoute;