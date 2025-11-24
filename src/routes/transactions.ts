import { Router } from 'express';
import { addTransaction, updatePaymentStatus, getPendingTransactions, getDailyTransactions, getAllTransactions } from '../controllers/transactionController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, addTransaction);
router.put('/:id/payment', authenticateToken, updatePaymentStatus);

router.get('/', authenticateToken, getAllTransactions);

export default router;