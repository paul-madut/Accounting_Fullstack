'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addExpense, updateExpense } from '@/services/expenses';
import { Expense } from '@/app/type/models/Expense';
import { useAuth } from '@/components/auth/AuthProvider';
import { ExpenseCategory } from '@/app/type/models/ExpenseCategory';

interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  isEditing?: boolean;
}

export default function ExpenseForm({ initialData, isEditing = false }: ExpenseFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || ExpenseCategory.OTHER,
    description: initialData?.description || '',
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to add expenses');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      if (isEditing && initialData?.id) {
        await updateExpense(initialData.id, {
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: new Date(formData.date),
        });
      } else {
        await addExpense({
          amount: parseFloat(formData.amount),
          category: formData.category,
          description: formData.description,
          date: new Date(formData.date),
          userId: user.uid,
        });
      }
      router.push('/expenses');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
      
      {error && <div className="bg-red-100 p-3 text-red-700 rounded">{error}</div>}
      
      <div>
        <label className="block mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label className="block mb-1">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Housing">Housing</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div>
        <label className="block mb-1">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block mb-1">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
}