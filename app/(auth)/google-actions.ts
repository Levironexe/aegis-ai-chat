"use server";

import { signIn } from "./auth";

type UserMetadata = {
  userId: string;
  email: string;
  name: string;
  picture?: string;
};

export async function handleGoogleAuthSuccess(userMetadata: UserMetadata) {
  try {
    // User is already created/updated in the backend database
    // Sign in with NextAuth using the custom Google provider
    await signIn("google", {
      userId: userMetadata.userId,
      email: userMetadata.email,
      name: userMetadata.name,
      image: userMetadata.picture,
      redirect: false,
    });

    return {
      success: true,
      user: {
        userId: userMetadata.userId,
        email: userMetadata.email,
        name: userMetadata.name,
        picture: userMetadata.picture,
      },
    };
  } catch (error) {
    console.error("Error handling Google auth:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
