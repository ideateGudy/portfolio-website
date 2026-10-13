'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/** PRD §5.5: email + password, show/hide, inline error, loading, → /dashboard. */
export default function LoginPage() {
  const router = useRouter();
  const { user, status, login, fetchMe } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already-authenticated admin visiting /login → go straight to the dashboard.
  useEffect(() => {
    if (status === 'idle') void fetchMe();
  }, [status, fetchMe]);

  useEffect(() => {
    if (status === 'authenticated' && user) router.replace('/dashboard');
  }, [status, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace('/dashboard');
    } catch (err) {
      // Generic message only — never leak which field was wrong (PRD §4).
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="glass p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-fg">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Admin access only.</p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-fg">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
                className="h-11 w-full rounded-xl border border-line bg-transparent px-4 pr-16 text-sm text-fg placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-2 my-1 rounded-lg px-2 text-xs font-medium text-muted hover:text-fg"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p id="login-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="mt-2 w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}
