import dns from "dns";
import mongoose from "mongoose";
import { logger, isProduction } from "./utils";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables");
}

// Local router DNS often rejects Node's SRV/TXT lookups for mongodb+srv://
if (MONGODB_URI.startsWith("mongodb+srv://")) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (error) {
    logger.warn("Unable to configure public DNS servers for MongoDB SRV lookup:", error);
  }
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4, // Prefer IPv4; avoids flaky IPv6 DNS on some Windows networks
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      const env = isProduction() ? 'Production' : 'Development';
      logger.log(`Connected to MongoDB Atlas (${env})`);
      return mongoose;
    }).catch((error) => {
      logger.error('MongoDB connection error:', error);
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
