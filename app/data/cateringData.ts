// Shared types
export type RecipeIngredient = { name: string; quantity: number };
export type MenuItem = { price: number; recipe: RecipeIngredient[] };
export type MenuItems = Record<string, MenuItem>;

// Shared ingredients database
export const ingredients: Record<
  string,
  { unitPrice: number; unit: string; stock: number; minStock: number }
> = {
  Rice: { unitPrice: 300, unit: "g", stock: 50000, minStock: 5000 },
  Tomatoes: { unitPrice: 200, unit: "g", stock: 20000, minStock: 2000 },
  Onions: { unitPrice: 100, unit: "g", stock: 15000, minStock: 1500 },
  Pepper: { unitPrice: 150, unit: "g", stock: 8000, minStock: 800 },
  "Chicken Stock": { unitPrice: 250, unit: "ml", stock: 10000, minStock: 1000 },
  Seasoning: { unitPrice: 100, unit: "g", stock: 3000, minStock: 300 },
  Oil: { unitPrice: 150, unit: "ml", stock: 5000, minStock: 500 },
  Spices: { unitPrice: 250, unit: "g", stock: 2000, minStock: 200 },
  "Mixed Vegetables": {
    unitPrice: 400,
    unit: "g",
    stock: 12000,
    minStock: 1200,
  },
  Eggs: { unitPrice: 200, unit: "pieces", stock: 500, minStock: 50 },
  "Soy Sauce": { unitPrice: 100, unit: "ml", stock: 2000, minStock: 200 },
  Garlic: { unitPrice: 150, unit: "g", stock: 3000, minStock: 300 },
  "Green Peas": { unitPrice: 250, unit: "g", stock: 4000, minStock: 400 },
  "Chicken Breast": { unitPrice: 1500, unit: "g", stock: 8000, minStock: 1000 },
  "Marinade Mix": { unitPrice: 200, unit: "ml", stock: 3000, minStock: 300 },
  Lemon: { unitPrice: 100, unit: "pieces", stock: 100, minStock: 10 },
  Herbs: { unitPrice: 300, unit: "g", stock: 1500, minStock: 150 },
  Beef: { unitPrice: 1200, unit: "g", stock: 6000, minStock: 800 },
  Ginger: { unitPrice: 100, unit: "g", stock: 2000, minStock: 200 },
  "Beef Stock": { unitPrice: 150, unit: "ml", stock: 5000, minStock: 500 },
  Lettuce: { unitPrice: 200, unit: "g", stock: 3000, minStock: 300 },
  Cucumber: { unitPrice: 100, unit: "g", stock: 4000, minStock: 400 },
  Carrots: { unitPrice: 100, unit: "g", stock: 3500, minStock: 350 },
  "Olive Oil": { unitPrice: 150, unit: "ml", stock: 2000, minStock: 200 },
  Vinegar: { unitPrice: 100, unit: "ml", stock: 1500, minStock: 150 },
  Yam: { unitPrice: 800, unit: "g", stock: 25000, minStock: 3000 },
  Water: { unitPrice: 50, unit: "ml", stock: 100000, minStock: 10000 },
  Salt: { unitPrice: 50, unit: "g", stock: 5000, minStock: 500 },
  Processing: { unitPrice: 300, unit: "service", stock: 1000, minStock: 100 },
};

// Shared menu items with recipes
export const menuItems: MenuItems = {
  "Jollof Rice": {
    price: 1500,
    recipe: [
      { name: "Rice", quantity: 200 },
      { name: "Tomatoes", quantity: 100 },
      { name: "Onions", quantity: 50 },
      { name: "Pepper", quantity: 30 },
      { name: "Chicken Stock", quantity: 300 },
      { name: "Seasoning", quantity: 20 },
      { name: "Oil", quantity: 30 },
      { name: "Spices", quantity: 10 },
    ],
  },
  "Fried Rice": {
    price: 1800,
    recipe: [
      { name: "Rice", quantity: 200 },
      { name: "Mixed Vegetables", quantity: 150 },
      { name: "Eggs", quantity: 2 },
      { name: "Soy Sauce", quantity: 20 },
      { name: "Onions", quantity: 50 },
      { name: "Garlic", quantity: 20 },
      { name: "Oil", quantity: 40 },
      { name: "Seasoning", quantity: 15 },
      { name: "Green Peas", quantity: 80 },
    ],
  },
  "Grilled Chicken": {
    price: 2500,
    recipe: [
      { name: "Chicken Breast", quantity: 300 },
      { name: "Marinade Mix", quantity: 50 },
      { name: "Lemon", quantity: 1 },
      { name: "Herbs", quantity: 20 },
      { name: "Garlic", quantity: 15 },
      { name: "Oil", quantity: 20 },
      { name: "Pepper", quantity: 10 },
      { name: "Salt", quantity: 5 },
    ],
  },
  "Beef Stew": {
    price: 2200,
    recipe: [
      { name: "Beef", quantity: 250 },
      { name: "Tomatoes", quantity: 150 },
      { name: "Onions", quantity: 100 },
      { name: "Pepper", quantity: 50 },
      { name: "Ginger", quantity: 20 },
      { name: "Garlic", quantity: 20 },
      { name: "Beef Stock", quantity: 200 },
    ],
  },
  "Vegetable Salad": {
    price: 800,
    recipe: [
      { name: "Lettuce", quantity: 100 },
      { name: "Tomatoes", quantity: 80 },
      { name: "Cucumber", quantity: 80 },
      { name: "Carrots", quantity: 60 },
      { name: "Olive Oil", quantity: 20 },
      { name: "Vinegar", quantity: 10 },
    ],
  },
  "Pounded Yam": {
    price: 1200,
    recipe: [
      { name: "Yam", quantity: 400 },
      { name: "Water", quantity: 500 },
      { name: "Processing", quantity: 1 },
    ],
  },
};
