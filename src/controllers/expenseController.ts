import { Response } from 'express';
import Expense from '../models/Expense';
import { AuthRequest } from '../middleware/auth';

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { date, title, description, amount } = req.body;
    
    const expense = new Expense({
      date,
      title,
      description: description || '',
      amount
    });

    await expense.save();
    res.json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    
    const filter = date ? { date } : {};
    const expenses = await Expense.find(filter).sort({ date: -1 });
    
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
};