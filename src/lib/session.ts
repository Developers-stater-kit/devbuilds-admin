import { headers } from "next/headers";

export async function GET_CURRENT_USER() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/get-session`, {
      headers: await headers(), 
      cache: 'no-store'
    });

    if (!res.ok) return null;
    const session = await res.json();
    return session?.user || null;
  } catch (error) {
    return null;
  }
}