import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Expense Tracker</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <LoginForm />
          
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
