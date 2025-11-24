import { Response } from 'express';
import Expense from '../models/Expense';
import User from '../models/admin';
import { AuthRequest } from '../middleware/auth';

export const addExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { expenseDate, title, description, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const expense = await Expense.create({
      expenseDate: expenseDate || new Date(),
      title,
      description,
      amount,
      createdBy: req.user?.id || null,
    });

    res.json({
      message: "Expense added successfully",
      expense: {
        ...expense.toJSON(),
        username: req.user?.username
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add expense" });
  }
};

export const getAllExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { title, username } = req.query;
    
    let filter: any = req.user?.role === 'Admin' ? {} : { createdBy: req.user?.id };
    
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    
    const expenses = await Expense.find(filter)
      .sort({ expenseDate: -1 });
    
    let expensesWithUsernames = await Promise.all(
      expenses.map(async (expense) => {
        const user = await User.findById(expense.createdBy);
        return {
          ...expense.toJSON(),
          username: user?.username || 'Unknown'
        };
      })
    );
    
    if (username) {
      expensesWithUsernames = expensesWithUsernames.filter(expense => 
        expense.username.toLowerCase().includes(username.toString().toLowerCase())
      );
    }
    
    res.json(expensesWithUsernames);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { expenseDate, title, description, amount } = req.body;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only allow update if the user is Admin or the creator of the expense
    if (req.user?.role !== 'Admin' && expense.createdBy !== String(req.user?.id)) {
      return res.status(403).json({ message: "Unauthorized to update this expense" });
    }

    expense.expenseDate = expenseDate || expense.expenseDate;
    expense.title = title || expense.title;
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;

    await expense.save();

    res.json({ message: "Expense updated successfully", expense });
  } catch (err) {
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    } 
    // Only allow deletion if the user is Admin or the creator of the expense
    if (req.user?.role !== 'Admin' && expense.createdBy !== String(req.user?.id)) {
      return res.status(403).json({ message: "Unauthorized to delete this expense" });
    }
    
    await Expense.deleteOne({ _id: id });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
