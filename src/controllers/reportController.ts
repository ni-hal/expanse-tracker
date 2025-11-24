import { Response } from 'express';
import Transaction from '../models/Transaction';
import Expense from '../models/Expense';
import Customer from '../models/Customer';
import Item from '../models/Item';
import { AuthRequest } from '../middleware/auth';

export const getFinancialSummary = async (req: AuthRequest, res: Response) => {
  try {
    const completedTransactions = await Transaction.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const pendingTransactions = await Transaction.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = completedTransactions[0]?.total || 0;
    const totalPending = pendingTransactions[0]?.total || 0;
    const totalExpense = totalExpenses[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;

    res.json({ totalIncome, totalPending, totalExpense, netBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
};

export const getCustomerLedger = async (req: AuthRequest, res: Response) => {
  try {
    const ledger = await Transaction.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $group: {
          _id: '$customerId',
          customerName: { $first: '$customer.name' },
          mobile: { $first: '$customer.mobile' },
          totalPaid: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, '$amount', 0] }
          },
          totalPending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] }
          }
        }
      }
    ]);

    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer ledger' });
  }
};

export const searchCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    const customers = await Customer.find({ name: { $regex: query, $options: 'i' } });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search customers' });
  }
};

export const searchItems = async (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    const items = await Item.find({ name: { $regex: query, $options: 'i' } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search items' });
  }
};