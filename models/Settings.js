import mongoose from 'mongoose';
const S = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  mileage: { type: Number, default: 40 },
  petrolPrice: { type: Number, default: 280 },
  reserveRate: { type: Number, default: 2 },
  reserveMode: { type: String, enum: ['auto', 'actual'], default: 'auto' },
}, { timestamps: true });
export default mongoose.models.Settings || mongoose.model('Settings', S);
