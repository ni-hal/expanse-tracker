# Smart Ledger & Expense Tracker

A TypeScript-based expense tracking application with user management, transaction handling, and financial reporting.

## Features

- **User Management**: Admin can create staff accounts with role-based access
- **Transaction Management**: Add income/sales with dynamic customer and item creation
- **Payment Tracking**: Update pending payments to completed status
- **Expense Management**: Record daily operational expenses
- **Financial Reports**: View summaries, customer ledgers, and daily reports

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Setup default admin user:
```bash
npm run dev -- src/setup.ts
```

4. Start the server:
```bash
npm start
```

## Default Login
- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/users` - Create new user (Admin only)

### Transactions
- `POST /api/transactions` - Add new transaction
- `PUT /api/transactions/:id/payment` - Update payment status
- `GET /api/transactions/pending` - Get pending transactions
- `GET /api/transactions/daily` - Get daily transactions

### Expenses
- `POST /api/expenses` - Add expense
- `GET /api/expenses` - Get expenses

### Reports
- `GET /api/reports/financial-summary` - Financial summary
- `GET /api/reports/customer-ledger` - Customer ledger
- `GET /api/reports/customers/search` - Search customers
- `GET /api/reports/items/search` - Search items

## Usage

1. Access the application at `http://localhost:3000`
2. Login with admin credentials
3. Create staff users (Admin only)
4. Add transactions and expenses
5. View financial reports and summaries