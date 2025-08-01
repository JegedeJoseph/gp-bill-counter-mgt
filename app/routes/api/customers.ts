import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { connectToDatabase } from "~/utils/db.server";
import { Customer } from "~/models/Customer";

export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const customers = await Customer.find({}).lean();
  return json(customers);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method.toLowerCase();
  await connectToDatabase();

  if (method === "post") {
    const data = await request.json();
    const newCustomer = await Customer.create(data);
    return json(newCustomer, { status: 201 });
  }

  if (method === "put") {
    const { _id, ...update } = await request.json();
    const updated = await Customer.findByIdAndUpdate(_id, update, { new: true });
    return json(updated);
  }

  if (method === "delete") {
    const { _id } = await request.json();
    await Customer.findByIdAndDelete(_id);
    return json({ success: true });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
