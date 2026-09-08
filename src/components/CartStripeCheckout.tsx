import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createCartCheckout } from "@/utils/payments.functions";

interface CartStripeCheckoutProps {
  items: { product_id: string; qty: number }[];
  shipping: number;
  customerEmail?: string;
  userId?: string;
  returnUrl: string;
}

export function CartStripeCheckout({
  items,
  shipping,
  customerEmail,
  userId,
  returnUrl,
}: CartStripeCheckoutProps) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createCartCheckout({
      data: {
        items,
        shipping,
        ...(customerEmail ? { customerEmail } : {}),
        ...(userId ? { userId } : {}),
        returnUrl,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("تعذّر بدء الدفع");
    return result.clientSecret;
  };

  return (
    <div id="checkout" className="mt-8">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
