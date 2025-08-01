import { json } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { ingredientsData, Ingredient } from "./ingredients_inventory";

// GET a specific ingredient
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id ? parseInt(params.id) : null;
  if (!id) return json({ error: "Invalid ID" }, { status: 400 });

  const ingredient = ingredientsData.find((ing: Ingredient) => ing.id === id);
  if (!ingredient)
    return json({ error: "Ingredient not found" }, { status: 404 });

  return json(ingredient);
};

// PUT or DELETE a specific ingredient
export const action: ActionFunction = async ({ request, params }) => {
  const method = request.method.toLowerCase();
  const id = params.id ? parseInt(params.id) : null;

  if (!id) return json({ error: "Invalid ID" }, { status: 400 });

  // For PUT requests (update ingredient)
  if (method === "put") {
    const formData = await request.json();
    const index = ingredientsData.findIndex((ing: Ingredient) => ing.id === id);

    if (index === -1)
      return json({ error: "Ingredient not found" }, { status: 404 });

    ingredientsData[index] = { ...ingredientsData[index], ...formData };
    return json(ingredientsData[index]);
  }

  // For DELETE requests
  if (method === "delete") {
    const index = ingredientsData.findIndex((ing: Ingredient) => ing.id === id);
    if (index === -1)
      return json({ error: "Ingredient not found" }, { status: 404 });

    const deleted = ingredientsData.splice(index, 1)[0];
    return json(deleted);
  }

  return json({ error: "Method not allowed" }, { status: 405 });
};
