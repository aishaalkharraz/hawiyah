import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) {
    throw new Error("Invalid userId");
  }
  if (options.userId) {
    const found = await stripe.customers.search({
      query: `metadata['userId']:'${options.userId}'`,
      limit: 1,
    });
    if (found.data.length) return found.data[0]!.id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0]!;
      if (options.userId && customer.metadata?.['userId'] !== options.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: options.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(options.email && { email: options.email }),
    ...(options.userId && { metadata: { userId: options.userId } }),
  });
  return created.id;
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: {
    priceId: string;
    quantity?: number;
    customerEmail?: string;
    userId?: string;
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    if (!/^[a-zA-Z0-9_-]+$/.test(data.priceId)) throw new Error("Invalid priceId");
    return data;
  })
  .handler(async ({ data }): Promise<CheckoutSessionResult> => {
    try {
      const stripe = createStripeClient(data.environment);

      const prices = await stripe.prices.list({ lookup_keys: [data.priceId] });
      if (!prices.data.length) throw new Error("Price not found");
      const stripePrice = prices.data[0]!;
      const isRecurring = stripePrice.type === "recurring";

      const customerId = (data.customerEmail || data.userId)
        ? await resolveOrCreateCustomer(stripe, {
            ...(data.customerEmail ? { email: data.customerEmail } : {}),
            ...(data.userId ? { userId: data.userId } : {}),
          })
        : undefined;

      let productDescription: string | undefined;
      if (!isRecurring) {
        const productId = typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        productDescription = (product as Stripe.Product).name;
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: data.quantity || 1 }],
        mode: isRecurring ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        automatic_tax: { enabled: true },
        ...(customerId && { customer: customerId }),
        ...(!isRecurring && { payment_intent_data: { description: productDescription } }),
        ...(data.userId && {
          metadata: { userId: data.userId },
          ...(isRecurring && { subscription_data: { metadata: { userId: data.userId } } }),
        }),
      } as Stripe.Checkout.SessionCreateParams);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });

type CartLine = { product_id: string; qty: number };

export const createCartCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: {
    items: CartLine[];
    shipping: number;
    customerEmail?: string;
    userId?: string;
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("السلة فارغة");
    }
    return data;
  })
  .handler(async ({ data }): Promise<CheckoutSessionResult> => {
    try {
      const { productPrices } = await import("@/data/prices");
      const stripe = createStripeClient(data.environment);

      const line_items = data.items.map((item) => {
        const product = productPrices[item.product_id];
        if (!product) throw new Error("منتج غير معروف");
        const qty = Math.max(1, Math.min(20, Math.floor(item.qty)));
        return {
          price_data: {
            currency: "kwd",
            product_data: { name: product.title },
            // KWD is a 3-decimal currency: minor unit = 1/1000.
            unit_amount: Math.round(product.price * 1000),
          },
          quantity: qty,
        };
      });

      if (data.shipping > 0) {
        line_items.push({
          price_data: {
            currency: "kwd",
            product_data: { name: "رسوم الشحن" },
            unit_amount: Math.round(data.shipping * 1000),
          },
          quantity: 1,
        });
      }

      const customerId = (data.customerEmail || data.userId)
        ? await resolveOrCreateCustomer(stripe, {
            ...(data.customerEmail ? { email: data.customerEmail } : {}),
            ...(data.userId ? { userId: data.userId } : {}),
          })
        : undefined;

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        payment_intent_data: { description: "طلب من متجر هوية" },
        ...(customerId && { customer: customerId }),
        ...(data.userId && { metadata: { userId: data.userId } }),
      } as Stripe.Checkout.SessionCreateParams);

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
