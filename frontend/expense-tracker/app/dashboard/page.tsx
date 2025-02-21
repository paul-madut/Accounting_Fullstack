'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { getUserExpenses } from '@/services/expenses';
import { Expense } from '@/app/type/models/Expense';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/services/auth';

export default function Dashboard() {
  const { user, loading: authLoading, } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/');
      return;
    }
    
    const fetchExpenses = async () => {
      try {
        const userExpenses = await getUserExpenses(user.uid);
        setExpenses(userExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user, authLoading, router]);

  useEffect(() => {
    console.log("Auth state in dashboard:", { user, authLoading });
    
    if (authLoading) {
      console.log("Still waiting for auth to initialize...");
      return;
    }
    
    if (!user) {
      console.log("No user found, redirecting...");
      router.push('/');
      return;
    }
    
    // Rest of your code...
  }, [user, authLoading, router]);

  useEffect(() => {
    // Force loading to false after 5 seconds as a fallback
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timed out - forcing load completion");
        setLoading(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [loading]);
  
  if ( loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  // Calculate summary stats
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user?.displayName || user?.email}</span>
          <Link href="/expenses/add" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Add Expense
          </Link>
          <button 
            onClick={() => {
              signOut();
              router.push('/');
            }}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Total Expenses</h2>
          <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {expenses.length > 0 ? (
            <ul>
              {expenses.slice(0, 3).map(expense => (
                <li key={expense.id} className="mb-2 pb-2 border-b">
                  <div className="flex justify-between">
                    <span>{expense.category}</span>
                    <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses recorded yet.</p>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
        {Object.keys(expensesByCategory).length > 0 ? (
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span>{category}</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(amount / totalExpenses) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No expenses recorded yet.</p>
        )}
      </div>
      
      <div className="text-center">
        <Link href="/expenses" className="text-blue-500 hover:underline">
          View All Expenses →
        </Link>
      </div>
    </div>
  );
}