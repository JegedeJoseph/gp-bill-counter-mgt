import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { connectToDatabase } from "~/utils/db.server";
import { Ingredient } from "~/models/Ingredient";

// GET all ingredients, grouped by category
export const loader: LoaderFunction = async () => {
  await connectToDatabase();
  const ingredients = await Ingredient.find({}).lean();
  const grouped: Record<string, any[]> = {};
  for (const ing of ingredients) {
    if (!grouped[ing.category]) grouped[ing.category] = [];
    grouped[ing.category].push(ing);
  }
  return json(grouped);
};

// POST a new ingredient
export const action: ActionFunction = async ({ request }) => {
  const method = request.method.toLowerCase();

  if (method === "post") {
    await connectToDatabase();
    const formData = await request.json();
    const newIngredient = await Ingredient.create(formData);
    return json(newIngredient, { status: 201 });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
