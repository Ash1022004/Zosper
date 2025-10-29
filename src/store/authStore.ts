export interface AdminUser {
  email: string;
}

const AUTH_KEY = 'djp.auth.v1';

const ADMIN_EMAIL = 'ashish29133@gmail.com';
const ADMIN_PASSWORD = '123#Ashish';

export function getCurrentUser(): AdminUser | null {
  try {
    const str = localStorage.getItem(AUTH_KEY);
    return str ? (JSON.parse(str) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email } satisfies AdminUser));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getCurrentUser() != null;
}


