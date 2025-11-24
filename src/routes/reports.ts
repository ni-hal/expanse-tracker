import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getCustomerLedger, getDailyReport, getExpenseReport, getFinancialSummary, searchCustomers, searchItems } from '../controllers/reportController';

const router = express.Router();

router.get('/customer-ledger', authenticateToken, getCustomerLedger);
router.get('/daily-report', authenticateToken, getDailyReport);
router.get('/expense-report', authenticateToken, getExpenseReport);
router.get('/financial-summary', authenticateToken, getFinancialSummary);

export default router;