import { Router } from 'express';
import { login, registerAdmin, createUser } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register-admin', registerAdmin);
router.post('/users', authenticateToken, requireAdmin, createUser);

export default router;