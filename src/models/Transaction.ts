import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);