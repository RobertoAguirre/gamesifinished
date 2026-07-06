import { Clerk } from '@clerk/clerk-js';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Falta VITE_CLERK_PUBLISHABLE_KEY');
}

export const clerk = new Clerk(publishableKey);

let loadPromise;

export function ensureClerkLoaded() {
  if (!loadPromise) {
    loadPromise = clerk.load();
  }
  return loadPromise;
}
