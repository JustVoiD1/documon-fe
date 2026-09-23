'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';
import Link from 'next/link';

export default function SignInForm() {
    const [state, formAction, isPending] = useActionState(signInWithEmail, null);

    return (
        <form action={formAction}
            className="flex flex-col gap-5 min-h-screen items-center justify-center bg-background">

            <div className="w-sm">
                <h1 className="mt-10 text-center text-2xl/9 font-bold text-foreground">Sign in to your account</h1>
            </div>

            <div className='flex flex-col gap-1.5 w-sm'>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">Email address</label>
                <input id="email" name="email" type="email" required placeholder="john@my-company.com"
                    className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-foreground outline-1 outline-white/10  focus:outline-primary" />
            </div>

            <div className='flex flex-col gap-1.5 w-sm'>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
                <input id="password" name="password" type="password" required placeholder="*****"
                    className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-foreground outline-1 outline-white/10  focus:outline-primary" />
            </div>

            {state?.error && (
                <div className="rounded-md px-3 py-2 text-sm text-destructive">
                    {state.error}
                </div>
            )}

            <button type="submit" disabled={isPending}
                className="flex w-sm justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-primary-foreground hover:bg-primary/80">
                Sign in
            </button>

            <p className='text-sm'>Don't have an account? <Link href="/auth/sign-up" className="text-primary hover:underline">Sign up</Link></p>
        </form>
    );
}