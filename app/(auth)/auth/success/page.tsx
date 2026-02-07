"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import { handleGoogleAuthSuccess } from "../../google-actions";

function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update: updateSession } = useSession();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      const userId = searchParams.get("userId");
      const email = searchParams.get("email");
      const name = searchParams.get("name");
      const picture = searchParams.get("picture");
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://localhost:8000";

      console.log("Auth callback - URL params:", {
        userId,
        email,
        name,
        picture,
      });

      if (!userId || !email) {
        console.error("Missing required auth parameters");
        setError("Missing user information from authentication");
        return;
      }

      try {
        // Store user metadata in localStorage
        localStorage.setItem("user_id", userId);
        localStorage.setItem("user_email", email);
        if (name) {
          localStorage.setItem("user_name", name);
        }
        if (picture) {
          localStorage.setItem("user_picture", picture);
        }

        // Establish session with backend by sending userId
        const backendResponse = await fetch(
          `${backendUrl}/auth/establish-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: userId }),
            credentials: "include", // Important: sends/receives cookies
          }
        );

        if (!backendResponse.ok) {
          throw new Error("Failed to establish backend session");
        }

        // Handle the Google auth success on the server (NextAuth)
        const result = await handleGoogleAuthSuccess({
          userId,
          email,
          name: name || "",
          picture: picture || "",
        });

        if (!result.success) {
          throw new Error(result.error || "Failed to authenticate");
        }

        console.log("Google user authenticated:", result.user);

        // Update NextAuth session
        await updateSession();

        // Redirect to home page
        router.push("/");
      } catch (err) {
        console.error("Error handling Google auth:", err);
        setError(err instanceof Error ? err.message : "Failed to authenticate");
      }
    };

    handleGoogleAuthCallback();
  }, [searchParams, router, updateSession]);

  if (error) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="font-semibold text-2xl text-red-600">
            Authentication Error
          </h1>
          <p className="text-gray-600 dark:text-zinc-400">{error}</p>
          <button
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => router.push("/login")}
            type="button"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-b-2 dark:border-white" />
        <p className="text-gray-600 dark:text-zinc-400">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-gray-900 border-b-2 dark:border-white" />
            <p className="text-gray-600 dark:text-zinc-400">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  );
}
