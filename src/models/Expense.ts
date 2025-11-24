import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true }
});

export default mongoose.model('Expense', expenseSchema);