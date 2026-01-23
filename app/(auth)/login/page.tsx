"use client";

import Link from "next/link";
import { GoogleSignInButton } from "@/components/google-signin-button";

export default function Page() {
  return (
    <div className="flex h-dvh w-screen items-start justify-center bg-background pt-12 md:items-center md:pt-0">
      <div className="flex w-full max-w-md flex-col gap-12 overflow-hidden rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="font-semibold text-xl dark:text-zinc-50">Sign In</h3>
          <p className="text-gray-500 text-sm dark:text-zinc-400">
            Sign in with your Google account
          </p>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-16">
          <GoogleSignInButton />
          <p className="mt-4 text-center text-gray-600 text-sm dark:text-zinc-400">
            {"Return to "}
            <Link
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
              href="/"
            >
              chat
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
