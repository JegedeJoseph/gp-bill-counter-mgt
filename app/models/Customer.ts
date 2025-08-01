import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  companyName: String;
  contactPerson: String;
  address: String;
  email: String;
  twitter: String;
  instagram: String;
  facebook: String;
  discord: String;
  linkedin: String;
  cateringType: String;
  mobile: String;
  dateJoined: String;
}

const CustomerSchema: Schema = new Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  discord: { type: String },
  linkedin: { type: String },
  cateringType: { type: String },
  mobile: { type: String, required: true },
  dateJoined: { type: String, required: true },
});

export const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
