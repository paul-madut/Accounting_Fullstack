import { 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db, expensesCollection } from '@/utils/firebase.browser';
import { Expense } from '@/app/type/models/Expense';  

export const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(expensesCollection, {
      ...expense,
      date: Timestamp.fromDate(new Date(expense.date)),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getUserExpenses = async (userId: string) => {
  try {
    const q = query(
      expensesCollection, 
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc: DocumentData) => {
      const data = doc.data();
      return { 
        ...data, 
        id: doc.id,
        // Convert Firestore Timestamp to JS Date
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate()
      } as Expense;
    });
  } catch (error) {
    console.error("Error getting expenses:", error);
    throw error;
  }
};

export const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
  try {
    const expenseRef = doc(db, "expenses", id);
    const updateData = { ...expenseData };
    
    // Convert date to Firestore Timestamp if present
    if (updateData.date) {
      updateData.date = (new Date(updateData.date));
    }
    
    await updateDoc(expenseRef, updateData);
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const expenseRef = doc(db, "expenses", id);
    await deleteDoc(expenseRef);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};
