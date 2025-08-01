const { connectToDatabase } = require("./db.server");
const mongoose = require("mongoose");

// Example schema and model for a 'users' collection
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema, "users");

async function testDbConnection() {
  try {
    await connectToDatabase();
    console.log("MongoDB connection successful");
    // Fetch all documents from the 'users' collection
    const users = await User.find({}).limit(5); // limit for demonstration
    console.log("Sample users:", users);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

testDbConnection();
