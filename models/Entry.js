import mongoose from 'mongoose';
const E = new mongoose.Schema({
  type: { type: String, enum: ['income', 'fuel', 'maintenance', 'commission', 'km'], required: true },
  app: { type: String, enum: ['InDrive', 'Yango', 'Other'], default: 'Other' },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
  amount: { type: Number, default: 0 },
  km: { type: Number, default: 0 },
  liters: { type: Number, default: 0 },
  petrolPrice: { type: Number, default: 0 },
  category: { type: String, default: '' },
  note: { type: String, default: '', maxlength: 200 },
}, { timestamps: true });
export default mongoose.models.Entry || mongoose.model('Entry', E);
