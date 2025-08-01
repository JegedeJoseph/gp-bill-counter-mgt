require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MONGO_URI is not defined in environment variables');
}

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  return mongoose.connect(MONGO_URI, { dbName: undefined });
}

// Example schema and model for a 'users' collection
const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

async function testDbConnection() {
  try {
    await connectToDatabase();
    console.log('MongoDB connection successful');
    // Fetch all documents from the 'users' collection
    const users = await User.find({}).limit(5); // limit for demonstration
    console.log('Sample users:', users);
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

testDbConnection();
