import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __hawiyaMongo: MongoClient | undefined;
}

async function getDb() {
  const uri = process.env["MONGODB_URI"];
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!globalThis.__hawiyaMongo) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await client.connect();
    globalThis.__hawiyaMongo = client;
  }
  return globalThis.__hawiyaMongo.db("hawiya");
}

export type MongoOrderBackup = {
  orderId: string;
  orderNumber: string;
  userId: string;
  fullName: string;
  phone: string;
  area: string;
  address: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  items: { productId: string; title: string; unitPrice: number; qty: number }[];
};

export async function mirrorOrderToMongo(order: MongoOrderBackup) {
  const db = await getDb();
  await db.collection("orders").updateOne(
    { orderId: order.orderId },
    { $set: { ...order, backedUpAt: new Date().toISOString() } },
    { upsert: true },
  );
}

export async function mirrorUserToMongo(user: {
  userId: string;
  fullName: string;
  email: string;
}) {
  const db = await getDb();
  await db.collection("users").updateOne(
    { userId: user.userId },
    { $set: { ...user, backedUpAt: new Date().toISOString() } },
    { upsert: true },
  );
}
