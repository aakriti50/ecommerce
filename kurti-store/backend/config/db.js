const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // If a real MONGO_URI is set, always use it — regardless of DEMO_MODE.
    // DEMO_MODE only kicks in for the DB when no real URI has been provided yet,
    // so you can fill in services one at a time (e.g. MongoDB first, Razorpay later).
    if (!uri) {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      console.log("No MONGO_URI set — using in-memory database (data resets on restart)");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
