import { Router } from 'express';
import { addExpense, getExpenses } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, addExpense);
router.get('/', authenticateToken, getExpenses);

export default router;