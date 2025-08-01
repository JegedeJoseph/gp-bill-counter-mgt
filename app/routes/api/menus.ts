import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { connectToDatabase } from "~/utils/db.server";
import { Menu } from "~/models/Menu";

export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const menus = await Menu.find({}).lean();
  return json(menus);
};

export const action: ActionFunction = async ({ request }) => {
  const method = request.method.toLowerCase();
  if (method === "post") {
    await connectToDatabase();
    const formData = await request.json();
    const newMenu = await Menu.create(formData);
    return json(newMenu, { status: 201 });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
};
