import { Response } from 'express';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction';
import Customer from '../models/Customer';
import Item from '../models/Item';
import { AuthRequest } from '../middleware/auth';

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { date,  amount } = req.body;
    

    
    const transaction = new Transaction({
      date,
      amount,
      enteredBy: req.user?.id
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to add transaction' });
  }
};

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await Transaction.find()
      .populate('customerId', 'name mobile')
      .populate('itemId', 'name')
      .populate('enteredBy', 'fullName');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const updateTransactionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const getCustomers = async (req: AuthRequest, res: Response) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getItems = async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};