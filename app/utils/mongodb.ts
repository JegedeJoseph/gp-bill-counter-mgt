import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/gp-bill-counter-mgt";
let client: MongoClient;
let db: Db;

export async function getDb() {
  if (!client || !client.isConnected()) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
  }
  return db;
}
