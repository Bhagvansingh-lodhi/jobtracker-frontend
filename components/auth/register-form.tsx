'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';

import { api } from '@/lib/api';

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
      });

      router.push('/login');
    } catch (error: any) {
      const message =
        error?.response?.data?.message;

      setError(
        Array.isArray(message)
          ? message.join(', ')
          : message ||
              'Unable to create account',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Full name
        </label>

        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Bhaggu"
            className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Minimum 8 characters"
            className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {loading
          ? 'Creating account...'
          : 'Create account'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}