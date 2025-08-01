import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecipeIngredient {
  name: string;
  quantity: number;
}

export interface IMenu extends Document {
  name: string;
  price: number;
  recipe: IRecipeIngredient[];
}

const RecipeIngredientSchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const MenuSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  recipe: { type: [RecipeIngredientSchema], default: [] },
});

export const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>("Menu", MenuSchema);
