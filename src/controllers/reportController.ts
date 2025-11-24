import { Response } from 'express';
import Transaction from '../models/Transaction';
import Expense from '../models/Expense';
import { AuthRequest } from '../middleware/auth';

export const getCustomerLedger = async (req: AuthRequest, res: Response) => {
  try {
    const ledger = await Transaction.aggregate([
      {
        $group: {
          _id: '$itemName',
          totalApproved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] } },
          totalPending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] } },
          totalRejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, '$amount', 0] } }
        }
      },
      {
        $project: {
          itemName: '$_id',
          totalApproved: 1,
          totalPending: 1,
          totalRejected: 1,
          _id: 0
        }
      }
    ]);
    res.json({ status: 'success', data: ledger });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer ledger' });
  }
};

export const getDailyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const transactions = await Transaction.find(filter)
      .populate('enteredBy', 'username')
      .select('date itemName amount status enteredBy');
    res.json({ status: 'success', data: transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily report' });
  }
};

export const getExpenseReport = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.find()
      .select('expenseDate title description amount')
      .sort({ expenseDate: -1 });
    res.json({ status: 'success', data: expenses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense report' });
  }
};

export const getFinancialSummary = async (req: AuthRequest, res: Response) => {
  try {
    const [incomeData, expenseData] = await Promise.all([
      Transaction.aggregate([
        {
          $group: {
            _id: null,
            totalApproved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, '$amount', 0] } },
            totalPending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, '$amount', 0] } },
            totalRejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, '$amount', 0] } }
          }
        }
      ]),
      Expense.aggregate([
        { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
      ])
    ]);
    const totalApproved = incomeData[0]?.totalApproved || 0;
    const totalPending = incomeData[0]?.totalPending || 0;
    const totalRejected = incomeData[0]?.totalRejected || 0;
    const totalExpense = expenseData[0]?.totalExpense || 0;
    const netBalance = totalApproved - totalExpense;
    res.json({ status: 'success', data: { totalApproved, totalPending, totalRejected, totalExpense, netBalance } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial summary' });
  }
};

