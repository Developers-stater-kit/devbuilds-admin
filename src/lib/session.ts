import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

/**
 * Retrieves the current authenticated user from the session.
 * 
 * This function fetches the user session using the authentication API and returns
 * the user object if a valid session exists. It handles authentication errors
 * gracefully by returning null when the user is not authenticated or when
 * session retrieval fails.
 * 
 * @example
 * ```typescript
 * const user = await GET_CURRENT_USER();
 * if (user) {
 *   console.log('User is authenticated:', user.email);
 * } else {
 *   console.log('User is not authenticated');
 * }
 * ```
 * 
 * @throws {Error} When session retrieval fails due to server errors
 */
export async function GET_CURRENT_USER(): Promise<typeof auth.$Infer.Session['user'] | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      console.log('User not found');
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
