import Stripe from 'stripe';

const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = 'sandbox' | 'live';

const GATEWAY_STRIPE_BASE = 'https://connector-gateway.lovable.dev/stripe';

export function getConnectionApiKey(env: StripeEnv): string | undefined {
  return process.env['STRIPE_SECRET_KEY'] ||
    (env === 'sandbox' ? process.env['STRIPE_SANDBOX_API_KEY'] : process.env['STRIPE_LIVE_API_KEY']) ||
    process.env['STRIPE_SANDBOX_API_KEY'] ||
    process.env['STRIPE_LIVE_API_KEY'];
}

export function createStripeClient(env: StripeEnv): Stripe {
  const secretKey = getConnectionApiKey(env);

  // If a direct Stripe secret key (sk_test_... or sk_live_...) is provided, use Stripe API directly
  if (secretKey && secretKey.startsWith('sk_')) {
    return new Stripe(secretKey, {
      apiVersion: '2026-03-25.dahlia' as any,
    });
  }

  // Fallback to Lovable proxy gateway if configured
  const connectionApiKey = secretKey || getEnv('STRIPE_SANDBOX_API_KEY');
  const lovableApiKey = process.env['LOVABLE_API_KEY'];

  if (!lovableApiKey) {
    throw new Error('يرجى توفير مفتاح Stripe الخفي (STRIPE_SECRET_KEY ينتهي بـ sk_test_... أو sk_live_...).');
  }

  return new Stripe(connectionApiKey, {
    apiVersion: '2026-03-25.dahlia' as any,
    httpClient: Stripe.createFetchHttpClient((input, init) => {
      const stripeUrl = input instanceof Request ? input.url : input.toString();
      const gatewayUrl = stripeUrl.replace('https://api.stripe.com', GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(
            new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined)).entries(),
          ),
          'X-Connection-Api-Key': connectionApiKey,
          'Lovable-API-Key': lovableApiKey,
        },
      });
    }),
  });
}

export function getStripeErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const stripeError = error as {
      message?: string; type?: string; code?: string; decline_code?: string; param?: string; requestId?: string;
      raw?: { message?: string; type?: string; code?: string; decline_code?: string; param?: string; requestId?: string };
    };
    const message = stripeError.raw?.message ?? stripeError.message;
    if (message) {
      const details = [
        stripeError.raw?.type ?? stripeError.type,
        stripeError.raw?.code ?? stripeError.code,
        stripeError.raw?.decline_code ?? stripeError.decline_code,
        stripeError.raw?.param ?? stripeError.param,
        stripeError.raw?.requestId ?? stripeError.requestId,
      ].filter(Boolean);
      return details.length ? `${message} (${details.join(', ')})` : message;
    }
  }
  return 'Stripe request failed';
}
