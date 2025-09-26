// db.js
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log(
      "Connecting to MongoDB URI:",
      process.env.MONGO_URI ? "defined" : "MISSING!"
    );

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
