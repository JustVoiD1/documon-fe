import Link from 'next/link';
import { signout } from './auth/sign-out/actions';
import { Button } from '@/components/ui/button';
import { getUser } from './auth/user/actions';

import { redirect } from 'next/navigation';

// Server components using auth methods must be rendered dynamically

export const dynamic = 'force-dynamic';

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect('/chat');
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-background">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href="/auth/sign-up"
          className="inline-flex text-lg text-primary hover:underline"
        >
          Sign-up
        </Link>
        <Link
          href="/auth/sign-in"
          className="inline-flex text-lg text-primary hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  );
}