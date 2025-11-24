import { Router } from 'express';
import { addExpense, getAllExpenses } from '../controllers/expenseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, addExpense);
router.get('/', authenticateToken, getAllExpenses);

export default router;