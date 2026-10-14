import mongoose from 'mongoose';
// Serverless (Netlify) fix: connection ko global mein cache karte hain
// warna har request par nayi connection ban kar Atlas limit khatam ho jati hai.
const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable set nahi hai');
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false, maxPoolSize: 5, serverSelectionTimeoutMS: 8000,
    });
  }
  try { cached.conn = await cached.promise; }
  catch (e) { cached.promise = null; throw e; }
  return cached.conn;
}
