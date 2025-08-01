import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICateringType extends Document {
  name: string;
  extraCost: number;
}

const CateringTypeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  extraCost: { type: Number, required: true },
});

export const CateringType: Model<ICateringType> =
  mongoose.models.CateringType || mongoose.model<ICateringType>("CateringType", CateringTypeSchema);
