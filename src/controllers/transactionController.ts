import { Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';
import { stat } from 'fs';

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { date, amount, itemName } = req.body;
    
    const transaction = new Transaction({
      date,
      amount,
      itemName,
    
      enteredBy: req.user?.id
    });
    await transaction.save();
    
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('enteredBy', 'username mobile');
    
    res.status(200).json({ message: 'Transaction added', data: populatedTransaction, status: 'success', statusCode: 200 });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to add transaction', status: 'error', statusCode: 400 });
  }
};
 
export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { itemName, date, username } = req.query;
    
    let filter: any = {};
    
    if (itemName) {
      filter.itemName = { $regex: itemName, $options: 'i' };
    }
    
    if (date) {
      filter.date = date;
    }
    
    const transactions = await Transaction.find(filter)
      .populate("enteredBy", "username mobile");
    
    let filteredTransactions = transactions;
    
    if (username) {
      filteredTransactions = transactions.filter(transaction => 
        transaction.enteredBy && 
        (transaction.enteredBy as any).username && 
        (transaction.enteredBy as any).username.toLowerCase().includes(username.toString().toLowerCase())
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Transactions fetched successfully",
      data: filteredTransactions,
      statusCode: 200
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch transactions",
    });
  }
};


export const updateTransactionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Completed', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('enteredBy', 'username');
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};



