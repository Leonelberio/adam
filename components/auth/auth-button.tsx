"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export const AuthButton = () => {
  const { data: session } = useSession();

  return session ? (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 rounded bg-red-500 text-white"
    >
      Sign Out
    </button>
  ) : (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 rounded bg-blue-500 text-white"
    >
      Sign In
    </button>
  );
};
