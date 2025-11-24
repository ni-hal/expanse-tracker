import express from 'express';
import { addTransaction, getAllTransactions, updateTransactionStatus, getCustomers, getItems } from '../controllers/transactionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, addTransaction);
router.get('/', authenticateToken, requireAdmin, getAllTransactions);
router.put('/:id/status', authenticateToken, requireAdmin, updateTransactionStatus);
router.get('/customers', authenticateToken, getCustomers);
router.get('/items', authenticateToken, getItems);

export default router;