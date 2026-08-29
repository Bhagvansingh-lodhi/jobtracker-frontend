import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md animate-[fadeInUp_0.6s_ease-out_forwards]">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 transition-all hover:scale-105"
          >
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Job
            </span>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Tracker
            </span>
          </Link>

          <div className="mt-8 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h1>
            <p className="text-sm text-gray-600">
              Sign in to continue managing your job applications
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/80 bg-white/95 p-6 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-blue-600 transition-colors hover:text-blue-700 hover:underline">
            Terms
          </Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-blue-600 transition-colors hover:text-blue-700 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}