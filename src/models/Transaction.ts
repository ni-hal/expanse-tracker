import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Completed', 'Pending'], default: 'Pending' },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

export default mongoose.model('Transaction', transactionSchema);