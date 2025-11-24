import express from 'express';
import { addTransaction, getAllTransactions, updateTransactionStatus} from '../controllers/transactionController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, addTransaction);
router.get('/', authenticateToken, requireAdmin, getAllTransactions);
router.put('/:id/status', authenticateToken, requireAdmin, updateTransactionStatus);

export default router;