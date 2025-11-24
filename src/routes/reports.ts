import { Router } from 'express';
import { getFinancialSummary, getCustomerLedger, searchCustomers, searchItems } from '../controllers/reportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/financial-summary', authenticateToken, getFinancialSummary);
router.get('/customer-ledger', authenticateToken, getCustomerLedger);
router.get('/customers/search', authenticateToken, searchCustomers);
router.get('/items/search', authenticateToken, searchItems);

export default router;