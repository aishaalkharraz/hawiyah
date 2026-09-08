import { loadStripe, Stripe } from "@stripe/stripe-js";

type StripeEnv = 'sandbox' | 'live';

const getPublishableKey = (): string | undefined => {
  return (
    (import.meta.env['VITE_PAYMENTS_CLIENT_TOKEN'] as string) ||
    (import.meta.env['VITE_STRIPE_PUBLISHABLE_KEY'] as string) ||
    (typeof process !== 'undefined' ? process.env['VITE_STRIPE_PUBLISHABLE_KEY'] : undefined)
  );
};

function paymentsEnvironment(): StripeEnv {
  const token = getPublishableKey();
  if (token?.startsWith('pk_test_')) return 'sandbox';
  if (token?.startsWith('pk_live_')) return 'live';
  throw new Error(
    "لم يتم إعداد مفاتيح Stripe بعد. يرجى توفير Publishable Key (pk_test_... أو pk_live_...)."
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    paymentsEnvironment();
    const token = getPublishableKey()!;
    stripePromise = loadStripe(token);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}
