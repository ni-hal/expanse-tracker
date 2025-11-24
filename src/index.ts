import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database';

import authRoutes from './routes/auth';
import transactionRoutes from './routes/transactions';
import expenseRoutes from './routes/expenses';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);


db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
