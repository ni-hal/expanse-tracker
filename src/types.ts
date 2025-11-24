export interface User {
  id?: number;
  fullName: string;
  username: string;
  password: string;
  mobile: string;
  role: 'Admin' | 'User';
}

export interface Customer {
  id?: number;
  name: string;
  mobile: string;
}

export interface Item {
  id?: number;
  name: string;
}

export interface Transaction {
  id?: number;
  date: string;
  customerId: number;
  customerName?: string;
  customerMobile?: string;
  itemId: number;
  itemName?: string;
  amount: number;
  status: 'Completed' | 'Pending';
  enteredBy: number;
  enteredByName?: string;
}

export interface Expense {
  id?: number;
  date: string;
  title: string;
  description?: string;
  amount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalPending: number;
  totalExpense: number;
  netBalance: number;
}

export interface CustomerLedger {
  customerName: string;
  mobile: string;
  totalPaid: number;
  totalPending: number;
}