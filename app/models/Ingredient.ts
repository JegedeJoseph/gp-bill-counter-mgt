import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIngredient extends Document {
  name: string;
  unit: string;
  price: number;
  category: string;
}

const IngredientSchema: Schema = new Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

export const Ingredient: Model<IIngredient> =
  mongoose.models.Ingredient ||
  mongoose.model<IIngredient>("Ingredient", IngredientSchema);
