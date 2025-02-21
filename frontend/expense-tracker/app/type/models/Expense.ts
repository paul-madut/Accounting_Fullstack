import { ExpenseCategory } from "./ExpenseCategory";

export interface Expense {
    id: string;
    amount: number;
    category: ExpenseCategory;
    date: Date;
    notes?: string;
    userId: string;
    createdAt: Date;
    description?: string;
  }
  
  // For Firestore conversions
  export interface FirestoreExpense extends Omit<Expense, 'date' | 'createdAt'> {
    date: FirebaseFirestore.Timestamp;
    createdAt: FirebaseFirestore.Timestamp;
  }