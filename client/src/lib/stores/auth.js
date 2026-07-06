import { writable } from 'svelte/store';
import { clerk, ensureClerkLoaded } from '../clerk.js';

export const user = writable(null);
export const authLoaded = writable(false);

export async function initAuth() {
  await ensureClerkLoaded();
  user.set(clerk.user ?? null);
  authLoaded.set(true);

  clerk.addListener(({ user: currentUser }) => {
    user.set(currentUser ?? null);
  });
}

export async function getToken() {
  return clerk.session ? clerk.session.getToken() : null;
}

export function signOut() {
  return clerk.signOut();
}
