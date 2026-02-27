import { CreateOrderAction } from "@/actions/store/orders.actions";
import { PAYMENT_METHODS } from "@/constants/payment-methods";
import type { PaymentMethodKey } from "@/constants/payment-methods";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="wrapper py-10 max-w-xl">
      <h1 className="h2-bold mb-6">Checkout</h1>

      <form
        action={async (formData) => {
          "use server";

          const fullName = String(formData.get("fullName") || "");
          const phone = String(formData.get("phone") || "");
          const address = String(formData.get("address") || "");

          // ✅ اقرأ Payment Method من الفورم
          const raw = String(formData.get("paymentMethod") || "cash_on_delivery");

          // ✅ Validation بسيط عشان مايتبعتش value غلط
          const allowed = PAYMENT_METHODS.map((m) => m.key);
          if (!allowed.includes(raw as PaymentMethodKey)) {
            throw new Error("Invalid payment method");
          }

          const paymentMethod = raw as PaymentMethodKey;

          await CreateOrderAction(slug, {
            fullName,
            phone,
            address,
            paymentMethod,
          });
        }}
        className="space-y-4"
      >
        <input
          name="fullName"
          placeholder="Full name"
          className="w-full border p-3 rounded-xl"
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          className="w-full border p-3 rounded-xl"
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          className="w-full border p-3 rounded-xl"
          rows={4}
          required
        />

        {/* ✅ Payment Method Select */}
        <select
          name="paymentMethod"
          className="w-full border p-3 rounded-xl"
          defaultValue="cash_on_delivery"
          required
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method.key} value={method.key}>
              {method.label}
            </option>
          ))}
        </select>

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Confirm Order
        </button>
      </form>
    </div>
  );
}