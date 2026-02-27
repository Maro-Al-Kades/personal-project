import { RegisterAction } from "@/actions/auth/register.actions";

const RegisterRoute = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        action={RegisterAction}
        className="w-full max-w-md space-y-4 border p-6 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-center">Create Your Store</h1>

        <div className="space-y-2">
          <label className="block text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Store Name</label>
          <input
            name="storeName"
            type="text"
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md"
        >
          Create Store
        </button>
      </form>
    </div>
  );
};

export default RegisterRoute;
