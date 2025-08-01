import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { connectToDatabase } from "~/utils/db.server";
import { CateringType } from "~/models/CateringType";

export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const types = await CateringType.find({}).lean();
  return json(types);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method.toLowerCase();
  if (method === "post") {
    await connectToDatabase();
    const formData = await request.json();
    const newType = await CateringType.create(formData);
    return json(newType, { status: 201 });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};
