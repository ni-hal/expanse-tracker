import { Schema, model, Document } from "mongoose";

export interface IExpense extends Document {
  expenseDate: Date;
  title: string;
  description?: string;
  amount: number;
  createdBy: string; // optional: admin/staff ID
}

const expenseSchema = new Schema<IExpense>(
  {
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now, // Default to today
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    createdBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default model<IExpense>("Expense", expenseSchema);
