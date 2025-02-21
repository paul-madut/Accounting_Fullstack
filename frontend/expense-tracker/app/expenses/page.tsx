'use client'

import { useState, useEffect } from 'react';
import { getUserExpenses } from "@/services/expenses";
import { Expense } from "@/app/type/models/Expense";
import { auth } from "@/utils/firebase.browser";

export default function ExpensesList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setLoading(true);
        try {
          const userExpenses = await getUserExpenses(user.uid);
          setExpenses(userExpenses);
        } catch (error) {
          console.error("Error loading expenses:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading expenses...</div>;

  return (
    <div>
      <h2>Your Expenses</h2>
      {expenses.length === 0 ? (
        <p>No expenses found. Add your first expense!</p>
      ) : (
        <ul>
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.amount} - {expense.category} - {expense.date.toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}