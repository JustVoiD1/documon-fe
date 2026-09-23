import { auth } from '@/lib/auth/server';
import Link from 'next/link';
import { signout } from './auth/sign-out/actions';
import { Button } from '@/components/ui/button';

// Server components using auth methods must be rendered dynamically

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-background">

        <h1 className="mb-4 text-4xl">
          Logged in as <span className="font-bold underline">{session.user.name}</span>
        </h1>
        <form action={signout}>
          <Button type="submit" variant="destructive">Sign out</Button>
        </form>
      </div>
    );
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