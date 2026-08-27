import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight"
          >
            Job<span className="text-blue-600">
              Tracker
            </span>
          </Link>

          <h1 className="mt-8 text-2xl font-bold text-gray-900">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <LoginForm />
        </div>

      </div>
    </main>
  );
}