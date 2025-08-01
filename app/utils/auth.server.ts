import { connectToDatabase } from "./db.server";
import { User, IUser } from "../models/User";
import bcrypt from "bcryptjs";

// LOGIN FUNCTION (email, password)
export async function login(email: string, password: string): Promise<IUser | null> {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
}

// SIGNUP FUNCTION (name, email, role, password)
export async function signup(name: string, email: string, role: string, password: string): Promise<IUser | null> {
  await connectToDatabase();
  const existing = await User.findOne({ email });
  if (existing) return null;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, role, password: hashedPassword });
  await user.save();
  return user;
}
