import { Response } from 'express';
import Transaction from '../models/Transaction';
import Customer from '../models/Customer';
import Item from '../models/Item';
import { AuthRequest } from '../middleware/auth';

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { date, customerName, customerMobile, itemName, amount, status } = req.body;
    
    // Validation
    if (!date || !customerName || !itemName || !amount || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    let customer = await Customer.findOne({ name: customerName });
    if (!customer) {
      customer = new Customer({ name: customerName, mobile: customerMobile });
      await customer.save();
    }

    let item = await Item.findOne({ name: itemName });
    if (!item) {
      item = new Item({ name: itemName });
      await item.save();
    }

    const transaction = new Transaction({
      date,
      customerId: customer._id,
      itemId: item._id,
      amount,
      status: status === 'paid' ? 'Completed' : 'Pending',
      enteredBy: req.user!.id
    });

    await transaction.save();
    res.json({ message: 'Transaction added successfully'  , status: 200 , data:transaction });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

export const updatePaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    await Transaction.findByIdAndUpdate(transactionId, { status: 'Completed' });
    
    res.json({ message: 'Payment status updated successfully', status: 200 , data:null });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
export const getAllTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    
    const transactions = await Transaction.find(filter)
      .populate('customerId', 'name mobile')
      .populate('itemId', 'name')
      .populate('enteredBy', 'fullName')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({ 
      message: 'Transactions fetched successfully', 
      status: 200, 
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};